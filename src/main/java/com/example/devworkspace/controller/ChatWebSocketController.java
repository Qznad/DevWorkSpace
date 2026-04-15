package com.example.devworkspace.controller;

import com.example.devworkspace.entity.Message;
import com.example.devworkspace.entity.Channel;
import com.example.devworkspace.entity.WorkspaceMember;
import com.example.devworkspace.entity.Announcement;
import com.example.devworkspace.entity.Assignment;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.HashMap;
import java.util.Map;

@Controller
public class ChatWebSocketController {
    
    private final SimpMessagingTemplate messagingTemplate;
    
    public ChatWebSocketController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    // ========== MESSAGE EVENTS ==========
    
    /**
     * Send a message in a specific channel
     * Client sends to: /app/workspace/{workspaceId}/channel/{channelId}/message
     */
    @MessageMapping("/workspace/{workspaceId}/channel/{channelId}/message")
    public void sendChannelMessage(
            @DestinationVariable String workspaceId,
            @DestinationVariable String channelId,
            Message message) {
        try {
            // Broadcast to all subscribers of this channel
            Map<String, Object> payload = new HashMap<>();
            payload.put("type", "NEW_MESSAGE");
            payload.put("message", message);
            payload.put("timestamp", System.currentTimeMillis());
            
            messagingTemplate.convertAndSend(
                    "/topic/workspace/" + workspaceId + "/channel/" + channelId,
                    (Object) payload
            );
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * Delete a message in a channel
     * Client sends to: /app/workspace/{workspaceId}/channel/{channelId}/message/delete
     */
    @MessageMapping("/workspace/{workspaceId}/channel/{channelId}/message/delete")
    public void deleteChannelMessage(
            @DestinationVariable String workspaceId,
            @DestinationVariable String channelId,
            Map<String, Object> payload) {
        try {
            Map<String, Object> response = new HashMap<>();
            response.put("type", "DELETE_MESSAGE");
            response.put("messageId", payload.get("messageId"));
            response.put("timestamp", System.currentTimeMillis());
            
            messagingTemplate.convertAndSend(
                    "/topic/workspace/" + workspaceId + "/channel/" + channelId,
                    (Object) response
            );
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // ========== CHANNEL EVENTS ==========
    
    /**
     * Create a new channel in workspace
     * Client sends to: /app/workspace/{workspaceId}/channel/create
     */
    @MessageMapping("/workspace/{workspaceId}/channel/create")
    public void createChannel(
            @DestinationVariable String workspaceId,
            Channel channel) {
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("type", "NEW_CHANNEL");
            payload.put("channel", channel);
            payload.put("timestamp", System.currentTimeMillis());
            
            messagingTemplate.convertAndSend(
                    "/topic/workspace/" + workspaceId + "/channels",
                    (Object) payload
            );
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * Delete a channel from workspace
     * Client sends to: /app/workspace/{workspaceId}/channel/delete
     */
    @MessageMapping("/workspace/{workspaceId}/channel/delete")
    public void deleteChannel(
            @DestinationVariable String workspaceId,
            Map<String, Object> payload) {
        try {
            Map<String, Object> response = new HashMap<>();
            response.put("type", "DELETE_CHANNEL");
            response.put("channelId", payload.get("channelId"));
            response.put("timestamp", System.currentTimeMillis());
            
            messagingTemplate.convertAndSend(
                    "/topic/workspace/" + workspaceId + "/channels",
                    (Object) response
            );
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // ========== MEMBER EVENTS ==========
    
    /**
     * Member joins or is added to workspace
     * Client sends to: /app/workspace/{workspaceId}/member/join
     */
    @MessageMapping("/workspace/{workspaceId}/member/join")
    public void memberJoined(
            @DestinationVariable String workspaceId,
            WorkspaceMember member) {
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("type", "MEMBER_JOINED");
            payload.put("member", member);
            payload.put("timestamp", System.currentTimeMillis());
            
            messagingTemplate.convertAndSend(
                    "/topic/workspace/" + workspaceId + "/members",
                    (Object) payload
            );
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * Member is removed from workspace
     * Client sends to: /app/workspace/{workspaceId}/member/leave
     */
    @MessageMapping("/workspace/{workspaceId}/member/leave")
    public void memberLeft(
            @DestinationVariable String workspaceId,
            Map<String, Object> payload) {
        try {
            Map<String, Object> response = new HashMap<>();
            response.put("type", "MEMBER_LEFT");
            response.put("memberId", payload.get("memberId"));
            response.put("userId", payload.get("userId"));
            response.put("timestamp", System.currentTimeMillis());
            
            messagingTemplate.convertAndSend(
                    "/topic/workspace/" + workspaceId + "/members",
                    (Object) response
            );
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // ========== ANNOUNCEMENT EVENTS ==========
    
    /**
     * New announcement created in workspace
     * Client sends to: /app/workspace/{workspaceId}/announcement/create
     */
    @MessageMapping("/workspace/{workspaceId}/announcement/create")
    public void announcementCreated(
            @DestinationVariable String workspaceId,
            Announcement announcement) {
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("type", "NEW_ANNOUNCEMENT");
            payload.put("announcement", announcement);
            payload.put("timestamp", System.currentTimeMillis());
            
            messagingTemplate.convertAndSend(
                    "/topic/workspace/" + workspaceId + "/announcements",
                    (Object) payload
            );
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * Announcement deleted from workspace
     * Client sends to: /app/workspace/{workspaceId}/announcement/delete
     */
    @MessageMapping("/workspace/{workspaceId}/announcement/delete")
    public void announcementDeleted(
            @DestinationVariable String workspaceId,
            Map<String, Object> payload) {
        try {
            Map<String, Object> response = new HashMap<>();
            response.put("type", "DELETE_ANNOUNCEMENT");
            response.put("announcementId", payload.get("announcementId"));
            response.put("timestamp", System.currentTimeMillis());
            
            messagingTemplate.convertAndSend(
                    "/topic/workspace/" + workspaceId + "/announcements",
                    (Object) response
            );
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // ========== ASSIGNMENT EVENTS ==========
    
    /**
     * New assignment created in workspace
     * Client sends to: /app/workspace/{workspaceId}/assignment/create
     */
    @MessageMapping("/workspace/{workspaceId}/assignment/create")
    public void assignmentCreated(
            @DestinationVariable String workspaceId,
            Assignment assignment) {
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("type", "NEW_ASSIGNMENT");
            payload.put("assignment", assignment);
            payload.put("timestamp", System.currentTimeMillis());
            
            messagingTemplate.convertAndSend(
                    "/topic/workspace/" + workspaceId + "/assignments",
                    (Object) payload
            );
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * Assignment deleted from workspace
     * Client sends to: /app/workspace/{workspaceId}/assignment/delete
     */
    @MessageMapping("/workspace/{workspaceId}/assignment/delete")
    public void assignmentDeleted(
            @DestinationVariable String workspaceId,
            Map<String, Object> payload) {
        try {
            Map<String, Object> response = new HashMap<>();
            response.put("type", "DELETE_ASSIGNMENT");
            response.put("assignmentId", payload.get("assignmentId"));
            response.put("timestamp", System.currentTimeMillis());
            
            messagingTemplate.convertAndSend(
                    "/topic/workspace/" + workspaceId + "/assignments",
                    (Object) response
            );
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // ========== LEGACY SUPPORT ==========
    
    /**
     * Legacy endpoint for backward compatibility
     */
    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/messages")
    public Map<String, Object> legacySendMessage(Message message) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("type", "NEW_MESSAGE");
        payload.put("message", message);
        payload.put("timestamp", System.currentTimeMillis());
        return payload;
    }
}