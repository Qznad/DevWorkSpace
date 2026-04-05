package com.example.devworkspace.service;

import com.example.devworkspace.dto.ChannelDto;
import com.example.devworkspace.entity.Channel;
import com.example.devworkspace.entity.Workspace;
import com.example.devworkspace.repository.ChannelRepository;
import com.example.devworkspace.repository.UserRepository;
import com.example.devworkspace.repository.WorkspaceRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChannelService {

    private final ChannelRepository channelRepository;
    private final WorkspaceRepository workspaceRepository;
    private final UserRepository userRepository;

    public ChannelService(ChannelRepository channelRepository,
                          WorkspaceRepository workspaceRepository,
                          UserRepository userRepository) {
        this.channelRepository = channelRepository;
        this.workspaceRepository = workspaceRepository;
        this.userRepository = userRepository;
    }

    // ----------------------------
    // Create channel (only workspace owner)
    // ----------------------------
    public Channel createChannel(Long workspaceId, Long requesterId, String name) {
        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new RuntimeException("Workspace not found"));

        if (!workspace.getOwner().getId().equals(requesterId)) {
            throw new RuntimeException("Only the workspace owner can create channels");
        }

        Channel channel = new Channel();
        channel.setName(name);
        channel.setWorkspace(workspace);

        return channelRepository.save(channel);
    }

    // ----------------------------
    // Get all channels of a workspace
    // ----------------------------
    public List<ChannelDto> getWorkspaceChannels(Long workspaceId) {
        return channelRepository.findByWorkspaceId(workspaceId)
                .stream()
                .map(ch -> {
                    ChannelDto dto = new ChannelDto();
                    dto.setId(ch.getId());
                    dto.setName(ch.getName());
                    dto.setWorkspaceId(ch.getWorkspace().getId());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    // ----------------------------
    // Delete channel (owner-only)
    // ----------------------------
    public void deleteChannel(Long channelId, Long requesterId) {
        Channel channel = channelRepository.findById(channelId)
                .orElseThrow(() -> new RuntimeException("Channel not found"));

        if (!channel.getWorkspace().getOwner().getId().equals(requesterId)) {
            throw new RuntimeException("Only the workspace owner can delete channels");
        }

        channelRepository.delete(channel);
    }

    // ----------------------------
    // Get a channel by ID (used for broadcasting)
    // ----------------------------
    public Channel getChannelById(Long channelId) {
        return channelRepository.findById(channelId)
                .orElseThrow(() -> new RuntimeException("Channel not found"));
    }
}