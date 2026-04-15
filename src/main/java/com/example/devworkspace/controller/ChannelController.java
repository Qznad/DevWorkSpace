package com.example.devworkspace.controller;

import com.example.devworkspace.dto.ChannelDto;
import com.example.devworkspace.entity.Channel;
import com.example.devworkspace.service.ChannelService;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/channels")
@CrossOrigin(origins = "http://localhost:3000") // allow frontend
public class ChannelController {

    private final ChannelService channelService;
    private final SimpMessagingTemplate messagingTemplate;

    public ChannelController(ChannelService channelService, SimpMessagingTemplate messagingTemplate) {
        this.channelService = channelService;
        this.messagingTemplate = messagingTemplate;
    }

    // ----------------------------
    // Get all channels in a workspace
    // ----------------------------
    @GetMapping("/workspace/{workspaceId}")
    public ResponseEntity<List<ChannelDto>> getChannels(@PathVariable Long workspaceId) {
        try {
            List<Channel> channels = channelService.getChannelsByWorkspace(workspaceId);
            List<ChannelDto> dtos = channels.stream()
                    .map(c -> new ChannelDto(c.getId(), c.getName(), c.getWorkspace().getId()))
                    .collect(Collectors.toList());
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // ----------------------------
    // Create a channel (owner-only)
    // ----------------------------
    @PostMapping("/workspace/{workspaceId}")
    public ResponseEntity<?> createChannel(
            @PathVariable Long workspaceId,
            @RequestParam Long requesterId,
            @RequestBody ChannelDto channelDto
    ) {
        try {
            Channel channel = channelService.createChannel(workspaceId, requesterId, channelDto.getName());

            ChannelDto responseDto = new ChannelDto(
                    channel.getId(),
                    channel.getName(),
                    channel.getWorkspace().getId()
            );

            // Broadcast new channel
            java.util.Map<String, Object> payload = new java.util.HashMap<>();
            payload.put("type", "NEW_CHANNEL");
            payload.put("channel", responseDto);
            payload.put("timestamp", System.currentTimeMillis());
            
            messagingTemplate.convertAndSend(
                    "/topic/workspace/" + workspaceId + "/channels",
                    (Object) payload
            );

            return ResponseEntity.ok(responseDto);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ----------------------------
    // Delete a channel (owner-only)
    // ----------------------------
    @DeleteMapping("/{channelId}")
    public ResponseEntity<?> deleteChannel(
            @PathVariable Long channelId,
            @RequestParam Long requesterId
    ) {
        try {
            Channel channel = channelService.getChannelById(channelId); // fetch for workspaceId
            Long workspaceId = channel.getWorkspace().getId();
            channelService.deleteChannel(channelId, requesterId);

            // Broadcast channel deletion
            java.util.Map<String, Object> payload = new java.util.HashMap<>();
            payload.put("type", "DELETE_CHANNEL");
            payload.put("channelId", channelId);
            payload.put("timestamp", System.currentTimeMillis());
            
            messagingTemplate.convertAndSend(
                    "/topic/workspace/" + workspaceId + "/channels",
                    (Object) payload
            );

            return ResponseEntity.ok(Map.of("message", "Channel deleted"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}