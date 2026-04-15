package com.example.devworkspace.dto;

import java.time.LocalDateTime;

public class AnnouncementResponse {
    private Long id;
    private String title;
    private String content;
    private Long workspaceId;
    private Long createdById;
    private LocalDateTime createdAt;

    // Constructor
    public AnnouncementResponse(Long id, String title, String content,
                                Long workspaceId, Long createdById, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.workspaceId = workspaceId;
        this.createdById = createdById;
        this.createdAt = createdAt;
    }

    // Getters
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getContent() { return content; }
    public Long getWorkspaceId() { return workspaceId; }
    public Long getCreatedById() { return createdById; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}