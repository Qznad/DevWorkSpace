package com.example.devworkspace.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
public class MessageDto {
    // Getters & Setters
    private Long id;
    private String content;
    private LocalDateTime createdAt;
    private Long senderId;
    private String senderName;
    private Long channelId;
    private String channelName;
    private Long workspaceId;

}