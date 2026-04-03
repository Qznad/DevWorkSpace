package com.example.devworkspace.controller;

import com.example.devworkspace.dto.MessageDto;
import com.example.devworkspace.entity.Message;
import com.example.devworkspace.service.MessageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/messages")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    // Send a message
    @PostMapping("/channel/{channelId}")
    public ResponseEntity<?> sendMessage(
            @PathVariable Long channelId,
            @RequestParam Long senderId,
            @RequestBody MessageDto messageDto
    ) {
        try {
            Message message = messageService.sendMessage(channelId, senderId, messageDto.getContent());
            return ResponseEntity.ok(messageService.mapToDto(message));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    // Delete a message (user-only, can delete their own)
    @DeleteMapping("/{messageId}")
    public ResponseEntity<?> deleteMessage(
            @PathVariable Long messageId,
            @RequestParam Long requesterId
    ) {
        try {
            messageService.deleteMessage(messageId, requesterId);
            return ResponseEntity.ok("{\"message\": \"Message deleted successfully\"}");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    // Get all messages in a channel
    @GetMapping("/channel/{channelId}")
    public ResponseEntity<List<MessageDto>> getMessages(@PathVariable Long channelId) {
        return ResponseEntity.ok(messageService.getChannelMessages(channelId));
    }
}