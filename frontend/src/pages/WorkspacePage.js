import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import workspaceService from "../services/workspaceService";
import channelService from "../services/channelService";
import memberService from "../services/memberService";
import messageService from "../services/messageService";
import announcementService from "../services/announcements";
import assignmentService from "../services/assignments";
import fileService from "../services/files";
import userService from "../services/users";
import { getCurrentUser } from "../services/auth";

import WorkspaceHeader from "../components/WorkspaceHeader";
import WorkspaceSwitcher from "../components/WorkspaceSwitcher";
import ChannelSidebar from "../components/ChannelSidebar";
import ChatPanel from "../components/ChatPanel";
import RightPanel from "../components/RightPanel";
import MemberPanel from "../components/MemberPanel";
import AnnouncementPanel from "../components/AnnouncementPanel";
import AssignmentPanel from "../components/AssignmentPanel";
import FilePanel from "../components/FilePanel";

import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import "./WorkspacePage.css";

export default function WorkspacePage() {
  const { workspaceId } = useParams();
  const navigate = useNavigate();

  const clientRef = useRef(null);
  const channelSubRef = useRef(null);
  const messageSubRef = useRef(null);
  const memberSubRef = useRef(null);
  const announcementSubRef = useRef(null);
  const assignmentSubRef = useRef(null);

  const [currentUser, setCurrentUser] = useState(null);
  const [workspace, setWorkspace] = useState(null);
  const [channels, setChannels] = useState([]);
  const [members, setMembers] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [allFiles, setAllFiles] = useState([]);
  const [messageAttachments, setMessageAttachments] = useState([]);
  const [assignmentAttachments, setAssignmentAttachments] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [activeTab, setActiveTab] = useState("members");
  const [fileContext, setFileContext] = useState("message");

  const [newMessage, setNewMessage] = useState("");
  const [newChannelName, setNewChannelName] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newAnnouncementTitle, setNewAnnouncementTitle] = useState("");
  const [newAnnouncementContent, setNewAnnouncementContent] = useState("");
  const [newAssignmentTitle, setNewAssignmentTitle] = useState("");
  const [newAssignmentDescription, setNewAssignmentDescription] = useState("");
  const [newAssignmentDue, setNewAssignmentDue] = useState("");
  const [newFileName, setNewFileName] = useState("");
  const [newFileUrl, setNewFileUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isOwner = workspace?.ownerEmail === currentUser?.email;

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      navigate("/login");
      return;
    }
    setCurrentUser(user);
  }, [navigate]);

  useEffect(() => {
    if (!currentUser) return;

    const fetchWorkspaceData = async () => {
      try {
        setLoading(true);
        const wsList = await workspaceService.getUserWorkspaces(currentUser.id);
        const ws = wsList.find((w) => w.id === parseInt(workspaceId, 10));
        if (!ws) {
          setError("Workspace not found.");
          return;
        }
        setWorkspace(ws);

        const [ch, mem, ann, assign, files, allUsers] = await Promise.all([
          channelService.getChannels(workspaceId),
          memberService.getWorkspaceMembers(workspaceId),
          announcementService.getAllAnnouncements(),
          assignmentService.getWorkspaceAssignments(workspaceId),
          fileService.getAllFiles(),
          userService.getAllUsers(),
        ]);

        setChannels(ch);
        if (ch.length > 0) setSelectedChannel(ch[0]);
        setMembers(mem);
        setAnnouncements(ann.filter((item) => item.workspaceId === ws.id));
        setAssignments(assign);
        setAllFiles(files);
        setUsers(allUsers);
      } catch (err) {
        console.error(err);
        setError("Failed to load workspace.");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspaceData();
  }, [currentUser, workspaceId]);

  useEffect(() => {
    if (!selectedChannel) return;
    const fetchMessages = async () => {
      try {
        const data = await messageService.getMessages(selectedChannel.id);
        setMessages(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMessages();
  }, [selectedChannel]);

  useEffect(() => {
    if (!currentUser) return;
    if (clientRef.current) return;

    console.log('Initializing WebSocket client...');
    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      reconnectDelay: 5000,
      debug: (str) => console.log('WebSocket:', str),
    });

    client.onConnect = () => {
      console.log('WebSocket connected successfully');
      // Connection is now established, subscriptions will be set up when workspace data loads
    };

    client.onStompError = (frame) => {
      console.error('WebSocket STOMP error:', frame);
    };

    client.onWebSocketError = (error) => {
      console.error('WebSocket error:', error);
    };

    client.activate();
    clientRef.current = client;

    return () => {
      console.log('Cleaning up WebSocket client');
      channelSubRef.current?.unsubscribe();
      messageSubRef.current?.unsubscribe();
      memberSubRef.current?.unsubscribe();
      announcementSubRef.current?.unsubscribe();
      assignmentSubRef.current?.unsubscribe();
      clientRef.current?.deactivate();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  // Subscribe to all workspace topics when data is loaded and client is connected
  useEffect(() => {
    if (!workspace || !clientRef.current || !workspaceId) return;

    // Wait for connection to be established
    const setupSubscriptions = () => {
      if (clientRef.current?.connected) {
        console.log('Setting up subscriptions for workspace:', workspaceId);
        subscribeToChannels();
        subscribeToMembers();
        subscribeToAnnouncements();
        subscribeToAssignments();
        if (selectedChannel) subscribeToMessages(selectedChannel);
      } else {
        // Retry after a short delay
        setTimeout(setupSubscriptions, 100);
      }
    };

    setupSubscriptions();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspace, workspaceId]);

  // Subscribe to messages when channel changes and client is connected
  useEffect(() => {
    if (!selectedChannel || !clientRef.current || !workspaceId) return;

    const setupMessageSubscription = () => {
      if (clientRef.current?.connected) {
        console.log('Setting up message subscription for channel:', selectedChannel.id);
        subscribeToMessages(selectedChannel);
      } else {
        // Retry after a short delay
        setTimeout(setupMessageSubscription, 100);
      }
    };

    setupMessageSubscription();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChannel]);

  const subscribeToChannels = () => {
    if (!clientRef.current?.connected || !workspaceId) {
      console.log('Cannot subscribe to channels: client not connected or no workspaceId');
      return;
    }
    console.log('Subscribing to channels for workspace:', workspaceId);
    channelSubRef.current?.unsubscribe();
    channelSubRef.current = clientRef.current.subscribe(
      `/topic/workspace/${workspaceId}/channels`,
      (msg) => {
        console.log('Received channel message:', msg.body);
        const body = JSON.parse(msg.body);
        if (body.type === "NEW_CHANNEL") {
          setChannels((prev) => [...prev, body.channel]);
        } else if (body.type === "DELETE_CHANNEL") {
          setChannels((prev) => prev.filter((c) => c.id !== body.channelId));
          if (selectedChannel?.id === body.channelId) setSelectedChannel(null);
        }
      }
    );
  };

  const subscribeToMessages = (channel) => {
    if (!clientRef.current?.connected || !workspaceId || !channel) {
      console.log('Cannot subscribe to messages: client not connected, no workspaceId, or no channel');
      return;
    }
    console.log('Subscribing to messages for channel:', channel.id, 'in workspace:', workspaceId);
    messageSubRef.current?.unsubscribe();
    messageSubRef.current = clientRef.current.subscribe(
      `/topic/workspace/${workspaceId}/channel/${channel.id}`,
      (msg) => {
        console.log('Received message:', msg.body);
        const body = JSON.parse(msg.body);
        if (body.type === "NEW_MESSAGE") {
          setMessages((prev) => {
            // Deduplicate: replace optimistic message or add new one
            const exists = prev.some((m) => m.id === body.message.id);
            if (exists) {
              return prev.map((m) => m.id === body.message.id ? body.message : m);
            }
            return [...prev, body.message];
          });
        } else if (body.type === "DELETE_MESSAGE") {
          setMessages((prev) => prev.filter((m) => m.id !== body.messageId));
        }
      }
    );
  };

  const subscribeToMembers = () => {
    if (!clientRef.current?.connected || !workspaceId) {
      console.log('Cannot subscribe to members: client not connected or no workspaceId');
      return;
    }
    console.log('Subscribing to members for workspace:', workspaceId);
    memberSubRef.current?.unsubscribe();
    memberSubRef.current = clientRef.current.subscribe(
      `/topic/workspace/${workspaceId}/members`,
      (msg) => {
        console.log('Received member message:', msg.body);
        const body = JSON.parse(msg.body);
        if (body.type === "MEMBER_JOINED") {
          setMembers((prev) => [...prev, body.member]);
        } else if (body.type === "MEMBER_LEFT") {
          setMembers((prev) => prev.filter((m) => m.userId !== body.userId));
        }
      }
    );
  };

  const subscribeToAnnouncements = () => {
    if (!clientRef.current?.connected || !workspaceId) {
      console.log('Cannot subscribe to announcements: client not connected or no workspaceId');
      return;
    }
    console.log('Subscribing to announcements for workspace:', workspaceId);
    announcementSubRef.current?.unsubscribe();
    announcementSubRef.current = clientRef.current.subscribe(
      `/topic/workspace/${workspaceId}/announcements`,
      (msg) => {
        console.log('Received announcement message:', msg.body);
        const body = JSON.parse(msg.body);
        if (body.type === "NEW_ANNOUNCEMENT") {
          setAnnouncements((prev) => [body.announcement, ...prev]);
        } else if (body.type === "DELETE_ANNOUNCEMENT") {
          setAnnouncements((prev) => prev.filter((a) => a.id !== body.announcementId));
        }
      }
    );
  };

  const subscribeToAssignments = () => {
    if (!clientRef.current?.connected || !workspaceId) {
      console.log('Cannot subscribe to assignments: client not connected or no workspaceId');
      return;
    }
    console.log('Subscribing to assignments for workspace:', workspaceId);
    assignmentSubRef.current?.unsubscribe();
    assignmentSubRef.current = clientRef.current.subscribe(
      `/topic/workspace/${workspaceId}/assignments`,
      (msg) => {
        console.log('Received assignment message:', msg.body);
        const body = JSON.parse(msg.body);
        if (body.type === "NEW_ASSIGNMENT") {
          setAssignments((prev) => [body.assignment, ...prev]);
        } else if (body.type === "DELETE_ASSIGNMENT") {
          setAssignments((prev) => prev.filter((a) => a.id !== body.assignmentId));
        }
      }
    );
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChannel) return;
    
    const messageContent = newMessage.trim();
    
    try {
      // Send to API - backend will broadcast via WebSocket
      await messageService.sendMessage(selectedChannel.id, currentUser.id, messageContent);
      setNewMessage("");
    } catch (err) {
      console.error(err);
      alert("Failed to send message");
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm("Delete message?")) return;
    try {
      await messageService.deleteMessage(messageId, currentUser.id);
      // Backend broadcasts deletion via WebSocket
    } catch (err) {
      console.error(err);
      alert("Failed to delete message");
    }
  };

  const handleCreateChannel = async () => {
    if (!newChannelName.trim()) return;
    try {
      await channelService.createChannel(workspaceId, currentUser.id, newChannelName.trim());
      setNewChannelName("");
      // Backend broadcasts new channel via WebSocket
    } catch (err) {
      console.error(err);
      alert("Failed to create channel");
    }
  };

  const handleDeleteChannel = async (channelId) => {
    if (!window.confirm("Delete channel?")) return;
    try {
      await channelService.deleteChannel(channelId, currentUser.id);
      // Backend broadcasts deletion via WebSocket
    } catch (err) {
      console.error(err);
      alert("Failed to delete channel");
    }
  };

  const handleAddMember = async () => {
    if (!newMemberEmail.trim()) return;
    try {
      await memberService.addMember(workspaceId, currentUser.id, newMemberEmail.trim());
      // Backend broadcasts member addition via WebSocket - no manual state update needed
      setNewMemberEmail("");
    } catch (err) {
      console.error(err);
      alert("Failed to add member");
    }
  };

  const handleRemoveMember = async (memberId, userId) => {
    if (!window.confirm("Remove member?")) return;
    try {
      await memberService.removeMember(workspaceId, userId, currentUser.id);
      // Backend broadcasts member removal via WebSocket - no manual state update needed
    } catch (err) {
      console.error(err);
      alert("Failed to remove member");
    }
  };

  const handleCreateAnnouncement = async () => {
    try {
      await announcementService.createAnnouncement({
        title: newAnnouncementTitle,
        content: newAnnouncementContent,
        workspaceId: parseInt(workspaceId, 10),
        createdById: currentUser.id,
      });
      // Backend broadcasts creation via WebSocket - no manual state update needed
      setNewAnnouncementTitle("");
      setNewAnnouncementContent("");
    } catch (err) {
      console.error(err);
      alert("Failed to create announcement");
    }
  };

  const handleDeleteAnnouncement = async (announcementId) => {
    if (!window.confirm("Delete announcement?")) return;
    try {
      await announcementService.deleteAnnouncement(announcementId, currentUser.id);
      // Backend broadcasts deletion via WebSocket - no manual state update needed
    } catch (err) {
      console.error(err);
      alert("Failed to delete announcement");
    }
  };

  const handleCreateAssignment = async () => {
    try {
      await assignmentService.createAssignment({
        title: newAssignmentTitle,
        description: newAssignmentDescription,
        dueDate: `${newAssignmentDue}T23:59:59`,
        workspaceId: parseInt(workspaceId, 10),
        createdById: currentUser.id,
      });
      // Backend broadcasts creation via WebSocket - no manual state update needed
      setNewAssignmentTitle("");
      setNewAssignmentDescription("");
      setNewAssignmentDue("");
    } catch (err) {
      console.error(err);
      alert("Failed to create task");
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (!window.confirm("Delete task?")) return;
    try {
      await assignmentService.deleteAssignment(assignmentId, currentUser.id);
      // Backend broadcasts deletion via WebSocket - no manual state update needed
    } catch (err) {
      console.error(err);
      alert("Failed to delete task");
    }
  };

  const handleUploadFile = async () => {
    if (!newFileName.trim() || !newFileUrl.trim()) return;
    try {
      const payload = {
        filename: newFileName,
        fileUrl: newFileUrl,
        uploadedBy: { id: currentUser.id },
      };
      if (fileContext === "message" && selectedMessage) {
        payload.message = { id: selectedMessage.id };
      }
      if (fileContext === "assignment" && selectedAssignment) {
        payload.assignment = { id: selectedAssignment.id };
      }
      await fileService.uploadFile(payload);
      if (selectedMessage) {
        const data = await fileService.getFilesByMessage(selectedMessage.id);
        setMessageAttachments(data);
      }
      if (selectedAssignment) {
        const data = await fileService.getFilesByAssignment(selectedAssignment.id);
        setAssignmentAttachments(data);
      }
      setNewFileName("");
      setNewFileUrl("");
    } catch (err) {
      alert("Failed to upload file");
    }
  };

  const handleDeleteFile = async (fileId) => {
    if (!window.confirm("Delete file?")) return;
    try {
      await fileService.deleteFile(fileId);
      if (selectedMessage) {
        const data = await fileService.getFilesByMessage(selectedMessage.id);
        setMessageAttachments(data);
      }
      if (selectedAssignment) {
        const data = await fileService.getFilesByAssignment(selectedAssignment.id);
        setAssignmentAttachments(data);
      }
    } catch (err) {
      alert("Failed to delete file");
    }
  };

  const handleSelectMessage = (msg) => {
    setSelectedMessage(msg);
    setSelectedAssignment(null);
    setFileContext("message");
    setActiveTab("files");
  };

  const handleSelectAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setSelectedMessage(null);
    setFileContext("assignment");
    setActiveTab("files");
  };

  useEffect(() => {
    if (selectedMessage) {
      fileService.getFilesByMessage(selectedMessage.id).then(setMessageAttachments);
    }
  }, [selectedMessage]);

  useEffect(() => {
    if (selectedAssignment) {
      fileService.getFilesByAssignment(selectedAssignment.id).then(setAssignmentAttachments);
    }
  }, [selectedAssignment]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!currentUser || loading) return <div className="loading-screen">Loading...</div>;
  if (error) return <div className="error-screen">{error}</div>;

  return (
    <div className="workspace-page">
      <WorkspaceHeader
        workspace={workspace}
        currentUser={currentUser}
        isOwner={isOwner}
        onLogout={handleLogout}
      />

      <div className="workspace-container">
        <WorkspaceSwitcher
          currentUser={currentUser}
          currentWorkspaceId={workspaceId}
          onSelectWorkspace={(wsId) => navigate(`/workspace/${wsId}`)}
        />

        <ChannelSidebar
          channels={channels}
          selectedChannel={selectedChannel}
          onSelectChannel={setSelectedChannel}
          onCreateChannel={handleCreateChannel}
          onDeleteChannel={handleDeleteChannel}
          isOwner={isOwner}
          newChannelName={newChannelName}
          setNewChannelName={setNewChannelName}
        />

        <ChatPanel
          selectedChannel={selectedChannel}
          messages={messages}
          currentUser={currentUser}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          onSendMessage={handleSendMessage}
          onDeleteMessage={handleDeleteMessage}
          onMessageClick={handleSelectMessage}
        />

        <RightPanel activeTab={activeTab} setActiveTab={setActiveTab}>
          {activeTab === "members" && (
            <MemberPanel
              members={members}
              users={users}
              currentUser={currentUser}
              isOwner={isOwner}
              newMemberEmail={newMemberEmail}
              setNewMemberEmail={setNewMemberEmail}
              onAddMember={handleAddMember}
              onRemoveMember={handleRemoveMember}
            />
          )}

          {activeTab === "announcements" && (
            <AnnouncementPanel
              announcements={announcements}
              currentUser={currentUser}
              newTitle={newAnnouncementTitle}
              setNewTitle={setNewAnnouncementTitle}
              newContent={newAnnouncementContent}
              setNewContent={setNewAnnouncementContent}
              onCreate={handleCreateAnnouncement}
              onDelete={handleDeleteAnnouncement}
            />
          )}

          {activeTab === "assignments" && (
            <AssignmentPanel
              assignments={assignments}
              selectedAssignment={selectedAssignment}
              currentUser={currentUser}
              newTitle={newAssignmentTitle}
              setNewTitle={setNewAssignmentTitle}
              newDescription={newAssignmentDescription}
              setNewDescription={setNewAssignmentDescription}
              newDueDate={newAssignmentDue}
              setNewDueDate={setNewAssignmentDue}
              onCreate={handleCreateAssignment}
              onDelete={handleDeleteAssignment}
              onSelect={handleSelectAssignment}
            />
          )}

          {activeTab === "files" && (
            <FilePanel
              selectedMessage={selectedMessage}
              selectedAssignment={selectedAssignment}
              messageAttachments={messageAttachments}
              assignmentAttachments={assignmentAttachments}
              allFiles={allFiles}
              newFileName={newFileName}
              setNewFileName={setNewFileName}
              newFileUrl={newFileUrl}
              setNewFileUrl={setNewFileUrl}
              fileContext={fileContext}
              setFileContext={setFileContext}
              onUpload={handleUploadFile}
              onDelete={handleDeleteFile}
            />
          )}
        </RightPanel>
      </div>
    </div>
  );
}
