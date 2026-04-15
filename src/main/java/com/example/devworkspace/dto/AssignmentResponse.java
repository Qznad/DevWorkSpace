package com.example.devworkspace.dto;

import java.time.LocalDateTime;

public class AssignmentResponse {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime dueDate;
    private Long workspaceId;
    private Long createdById;
    private LocalDateTime createdAt;

    public AssignmentResponse(Long id, String title, String description,
                              LocalDateTime dueDate, Long workspaceId,
                              Long createdById, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.workspaceId = workspaceId;
        this.createdById = createdById;
        this.createdAt = createdAt;
    }

    // Getters
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public LocalDateTime getDueDate() { return dueDate; }
    public Long getWorkspaceId() { return workspaceId; }
    public Long getCreatedById() { return createdById; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}