package com.example.devworkspace.controller;

import com.example.devworkspace.dto.MessageDto;
import com.example.devworkspace.entity.Message;
import com.example.devworkspace.service.MessageService;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/messages")
public class MessageController {

    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;

    public MessageController(MessageService messageService, SimpMessagingTemplate messagingTemplate) {
        this.messageService = messageService;
        this.messagingTemplate = messagingTemplate;
    }

    // ----------------------------
    // Send a message
    // ----------------------------
    @PostMapping("/channel/{channelId}")
    public ResponseEntity<?> sendMessage(
            @PathVariable Long channelId,
            @RequestParam Long senderId,
            @RequestBody MessageDto messageDto
    ) {
        try {
            Message message = messageService.sendMessage(channelId, senderId, messageDto.getContent());
            MessageDto dto = messageService.mapToDto(message);

            // Broadcast the new message to clients subscribed to this channel
            messagingTemplate.convertAndSend(
                    "/topic/channel/" + channelId,
                    Optional.of(Map.of("type", "NEW_MESSAGE", "message", dto))
            );

            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ----------------------------
    // Delete a message
    // ----------------------------
    @DeleteMapping("/{messageId}")
    public ResponseEntity<?> deleteMessage(
            @PathVariable Long messageId,
            @RequestParam Long requesterId
    ) {
        try {
            // Delete message and get its DTO before deletion
            MessageDto dto = messageService.deleteMessage(messageId, requesterId);

            // Notify all subscribers that message was deleted
            messagingTemplate.convertAndSend(
                    "/topic/channel/" + dto.getChannelId(),
                    Optional.of(Map.of("type", "DELETE_MESSAGE", "messageId", dto.getId()))
            );

            return ResponseEntity.ok(Map.of("message", "Message deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ----------------------------
    // Get all messages in a channel
    // ----------------------------
    @GetMapping("/channel/{channelId}")
    public ResponseEntity<List<MessageDto>> getMessages(@PathVariable Long channelId) {
        return ResponseEntity.ok(messageService.getChannelMessages(channelId));
    }
}