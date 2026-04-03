package com.example.devworkspace.dto;

public class MessageRequestDto {
    private Long senderId;
    private String content;

    // Getters & Setters
    public Long getSenderId() { return senderId; }
    public void setSenderId(Long senderId) { this.senderId = senderId; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}