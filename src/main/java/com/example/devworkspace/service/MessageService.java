package com.example.devworkspace.service;

import com.example.devworkspace.dto.MessageDto;
import com.example.devworkspace.entity.Channel;
import com.example.devworkspace.entity.Message;
import com.example.devworkspace.entity.User;
import com.example.devworkspace.repository.ChannelRepository;
import com.example.devworkspace.repository.MessageRepository;
import com.example.devworkspace.repository.WorkspaceMemberRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final ChannelRepository channelRepository;
    private final UserService userService;
    private final WorkspaceMemberRepository workspaceMemberRepository;

    public MessageService(MessageRepository messageRepository,
                          ChannelRepository channelRepository,
                          UserService userService,
                          WorkspaceMemberRepository workspaceMemberRepository) {
        this.messageRepository = messageRepository;
        this.channelRepository = channelRepository;
        this.userService = userService;
        this.workspaceMemberRepository = workspaceMemberRepository;
    }

    // ----------------------------
    // Send a message
    // ----------------------------
    public Message sendMessage(Long channelId, Long senderId, String content) {
        // Validate content
        if (content == null || content.trim().isEmpty()) {
            throw new RuntimeException("Message content cannot be empty");
        }

        User sender = userService.getUserById(senderId);
        Channel channel = channelRepository.findById(channelId)
                .orElseThrow(() -> new RuntimeException("Channel not found"));

        // Authorization: Check if sender is a member of the workspace
        if (!workspaceMemberRepository.existsByWorkspaceAndUser(channel.getWorkspace(), sender)) {
            throw new RuntimeException("You are not a member of this workspace");
        }

        Message message = new Message();
        message.setContent(content);
        message.setSender(sender);
        message.setChannel(channel);

        return messageRepository.save(message);
    }

    // ----------------------------
    // Get messages in a channel
    // ----------------------------
    public List<MessageDto> getChannelMessages(Long channelId) {
        return messageRepository.findByChannelId(channelId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // ----------------------------
    // Map entity to DTO
    // ----------------------------
    public MessageDto mapToDto(Message message) {
        MessageDto dto = new MessageDto();
        dto.setId(message.getId());
        dto.setContent(message.getContent());
        dto.setCreatedAt(message.getCreatedAt());
        dto.setSenderId(message.getSender().getId());
        dto.setSenderName(message.getSender().getName());
        dto.setChannelId(message.getChannel().getId());
        dto.setChannelName(message.getChannel().getName());
        dto.setWorkspaceId(message.getChannel().getWorkspace().getId());
        return dto;
    }

    // ----------------------------
    // Delete a message
    // ----------------------------
    public MessageDto deleteMessage(Long messageId, Long requesterId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        // Authorization: Only message sender can delete their own messages
        if (!message.getSender().getId().equals(requesterId)) {
            throw new RuntimeException("You can only delete your own messages");
        }

        // Map to DTO before deletion
        MessageDto dto = mapToDto(message);

        // Delete the message
        messageRepository.delete(message);

        return dto; // return DTO so controller can broadcast deletion
    }
}