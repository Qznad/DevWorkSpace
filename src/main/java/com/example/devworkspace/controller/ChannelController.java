package com.example.devworkspace.controller;

import com.example.devworkspace.dto.ChannelDto;
import com.example.devworkspace.entity.Channel;
import com.example.devworkspace.service.ChannelService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/channels")
public class ChannelController {

    private final ChannelService channelService;

    public ChannelController(ChannelService channelService) {
        this.channelService = channelService;
    }

    // ----------------------------
    // Create a channel (owner-only)
    // POST /channels/workspace/{workspaceId}?requesterId=1
    // ----------------------------
    @PostMapping("/workspace/{workspaceId}")
    public ResponseEntity<?> createChannel(
            @PathVariable Long workspaceId,
            @RequestParam Long requesterId,
            @RequestBody ChannelDto channelDto
    ) {
        try {
            Channel channel = channelService.createChannel(workspaceId, requesterId, channelDto.getName());
            return ResponseEntity.ok(channel);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    // ----------------------------
    // Get all channels in a workspace
    // GET /channels/workspace/{workspaceId}
    // ----------------------------

    @GetMapping("/workspace/{workspaceId}")
    public ResponseEntity<List<ChannelDto>> getChannels(@PathVariable Long workspaceId) {
        return ResponseEntity.ok(channelService.getWorkspaceChannels(workspaceId));
    }

    // ----------------------------
    // Delete a channel (owner-only)
    // DELETE /channels/{channelId}?requesterId=1
    // ----------------------------

    @DeleteMapping("/{channelId}")
    public ResponseEntity<?> deleteChannel(
            @PathVariable Long channelId,
            @RequestParam Long requesterId
    ) {
        try {
            channelService.deleteChannel(channelId, requesterId);
            return ResponseEntity.ok("{\"message\": \"Channel deleted\"}");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}