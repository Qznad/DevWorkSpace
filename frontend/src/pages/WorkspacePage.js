import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import channelService from "../services/cs";
import workspaceService from "../services/wss";
import memberService from "../services/ms";
import { getCurrentUser } from "../services/auth";
import axios from "axios";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import "./WorkspacePage.css";

export default function WorkspacePage() {
  const { workspaceId } = useParams();
  const navigate = useNavigate();

  const messagesEndRef = useRef(null);
  const clientRef = useRef(null);
  const channelSubscriptionRef = useRef(null);
  const messageSubscriptionRef = useRef(null);

  const [currentUser, setCurrentUser] = useState(null);
  const [workspace, setWorkspace] = useState(null);
  const [channels, setChannels] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [newChannelName, setNewChannelName] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isOwner = workspace?.ownerEmail === currentUser?.email;

  // -------------------- Load current user --------------------
  useEffect(() => {
    const user = getCurrentUser();
    if (!user) navigate("/login");
    else setCurrentUser(user);
  }, [navigate]);

  // -------------------- Fetch workspace, channels, members --------------------
  useEffect(() => {
    if (!currentUser) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const wsList = await workspaceService.getUserWorkspaces(currentUser.id);
        const ws = wsList.find((w) => w.id === parseInt(workspaceId));
        if (!ws) {
          setError("Workspace not found or you don't have access.");
          return;
        }
        setWorkspace(ws);

        const ch = await channelService.getChannels(workspaceId);
        setChannels(ch);
        if (ch.length > 0) setSelectedChannel(ch[0]);

        const mem = await memberService.getWorkspaceMembers(workspaceId);
        setMembers(mem);
      } catch (err) {
        console.error(err);
        setError("Failed to load workspace data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser, workspaceId]);

  // -------------------- Fetch messages --------------------
  useEffect(() => {
    if (!selectedChannel) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/messages/channel/${selectedChannel.id}`
        );
        setMessages(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMessages();
  }, [selectedChannel]);

  // -------------------- Initialize STOMP Client --------------------
  useEffect(() => {
    if (!currentUser) return;
    if (clientRef.current) return;

    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      console.log("STOMP connected");

      // Subscribe to channels and messages
      subscribeToChannels();
      if (selectedChannel) subscribeToMessages(selectedChannel);
    };

    client.activate();
    clientRef.current = client;

    return () => {
      channelSubscriptionRef.current?.unsubscribe();
      messageSubscriptionRef.current?.unsubscribe();
      clientRef.current?.deactivate();
    };
  }, [currentUser]);

  // -------------------- Channels subscription --------------------
  const subscribeToChannels = () => {
    if (!clientRef.current || !clientRef.current.connected) return;

    channelSubscriptionRef.current?.unsubscribe();
    channelSubscriptionRef.current = clientRef.current.subscribe(
      `/topic/workspace/${workspaceId}/channels`,
      (msg) => {
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

  // -------------------- Messages subscription --------------------
  const subscribeToMessages = (channel) => {
    if (!clientRef.current || !clientRef.current.connected) return;

    messageSubscriptionRef.current?.unsubscribe();
    messageSubscriptionRef.current = clientRef.current.subscribe(
      `/topic/channel/${channel.id}`,
      (msg) => {
        const body = JSON.parse(msg.body);
        if (body.type === "NEW_MESSAGE") {
          setMessages((prev) => [...prev, body.message]);
        } else if (body.type === "DELETE_MESSAGE") {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === body.messageId ? { ...m, deleting: true } : m
            )
          );
          setTimeout(() => {
            setMessages((prev) =>
              prev.filter((m) => m.id !== body.messageId)
            );
          }, 300);
        }
      }
    );
  };

  // -------------------- Switch channel --------------------
  useEffect(() => {
    if (!selectedChannel || !clientRef.current) return;
    if (clientRef.current.connected) subscribeToMessages(selectedChannel);
  }, [selectedChannel]);

  // -------------------- Auto scroll --------------------
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // -------------------- Send / Delete Messages --------------------
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChannel) return;
    const content = newMessage.trim();
    setNewMessage("");

    try {
      await axios.post(
        `http://localhost:8080/messages/channel/${selectedChannel.id}`,
        { content },
        { params: { senderId: currentUser.id } }
      );
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to send message");
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await axios.delete(
        `http://localhost:8080/messages/${messageId}`,
        { params: { requesterId: currentUser.id } }
      );
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Cannot delete this message");
    }
  };

  // -------------------- Channels --------------------
  const handleCreateChannel = async () => {
    if (!newChannelName.trim()) return alert("Channel name cannot be empty");
    try {
      await channelService.createChannel(
        workspaceId,
        currentUser.id,
        newChannelName.trim()
      );
      setNewChannelName("");
      // Real-time update via WebSocket
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to create channel");
    }
  };

  const handleDeleteChannel = async (channelId) => {
    if (!window.confirm("Delete this channel?")) return;
    try {
      await channelService.deleteChannel(channelId, currentUser.id);
      // Real-time update via WebSocket
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to delete channel");
    }
  };

  // -------------------- Members --------------------
  const handleAddMember = async () => {
    if (!newMemberEmail.trim()) return alert("Enter a member email");
    try {
      await memberService.addMember(workspaceId, currentUser.id, newMemberEmail.trim());
      const updatedMembers = await memberService.getWorkspaceMembers(workspaceId);
      setMembers(updatedMembers);
      setNewMemberEmail("");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to add member");
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm("Remove this member?")) return;
    try {
      await memberService.removeMember(workspaceId, memberId, currentUser.id);
      setMembers((prev) => prev.filter((m) => m.userId !== memberId));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to remove member");
    }
  };

  // -------------------- Render --------------------
  if (!currentUser || loading) return <p className="loading">Loading workspace...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="workspace-layout">
      {/* Channels Sidebar */}
      <aside className="sidebar">
        <h3>Channels</h3>
        <div className="scrollable-list">
          {channels.map((ch) => (
            <div
              key={ch.id}
              className={`channel-item ${selectedChannel?.id === ch.id ? "active" : ""}`}
              onClick={() => setSelectedChannel(ch)}
            >
              # {ch.name}
              {isOwner && (
                <span
                  className="delete-btn"
                  onClick={(e) => { e.stopPropagation(); handleDeleteChannel(ch.id); }}
                >
                  ×
                </span>
              )}
            </div>
          ))}
        </div>
        {isOwner && (
          <div className="add-section">
            <input
              type="text"
              placeholder="New channel"
              value={newChannelName}
              onChange={(e) => setNewChannelName(e.target.value)}
            />
            <button onClick={handleCreateChannel}>+</button>
          </div>
        )}
      </aside>

      {/* Messages Area */}
      <main className="messages-area">
        <h3>{selectedChannel ? `#${selectedChannel.name}` : "Select a channel"}</h3>
        <div className="scrollable-list">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`member-item ${msg.deleting ? "deleting" : ""}`}
            >
              <div className="member-avatar">{msg.senderName[0]}</div>
              <div className="member-name">{msg.senderName}</div>
              <div>{msg.content}</div>
              {msg.senderId === currentUser.id && (
                <span className="delete-btn" onClick={() => handleDeleteMessage(msg.id)}>×</span>
              )}
            </div>
          ))}
          <div ref={messagesEndRef}></div>
        </div>
        {selectedChannel && (
          <div className="add-section">
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        )}
      </main>

      {/* Members Sidebar */}
      <aside className="sidebar">
        <h3>Members</h3>
        <div className="scrollable-list">
          {members.map((m) => (
            <div key={m.userId} className="member-item">
              <div className="member-avatar">{m.userName[0]}</div>
              <div className="member-name">{m.userName}</div>
              {isOwner && m.userId !== currentUser.id && (
                <span className="delete-btn" onClick={() => handleRemoveMember(m.userId)}>×</span>
              )}
            </div>
          ))}
        </div>
        {isOwner && (
          <div className="add-section">
            <input
              type="text"
              placeholder="Member email"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
            />
            <button onClick={handleAddMember}>+</button>
          </div>
        )}
      </aside>
    </div>
  );
}