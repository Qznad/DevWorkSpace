package com.example.devworkspace.service;

import com.example.devworkspace.dto.MessageDto;
import com.example.devworkspace.entity.Channel;
import com.example.devworkspace.entity.Message;
import com.example.devworkspace.entity.User;
import com.example.devworkspace.repository.ChannelRepository;
import com.example.devworkspace.repository.MessageRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final ChannelRepository channelRepository;
    private final UserService userService;

    public MessageService(MessageRepository messageRepository,
                          ChannelRepository channelRepository,
                          UserService userService) {
        this.messageRepository = messageRepository;
        this.channelRepository = channelRepository;
        this.userService = userService;
    }

    // ----------------------------
    // Send a message
    // ----------------------------
    public Message sendMessage(Long channelId, Long senderId, String content) {
        User sender = userService.getUserById(senderId);
        Channel channel = channelRepository.findById(channelId)
                .orElseThrow(() -> new RuntimeException("Channel not found"));

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