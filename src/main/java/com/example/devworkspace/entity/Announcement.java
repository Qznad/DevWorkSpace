package com.example.devworkspace.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "announcements")
public class Announcement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workspace_id", nullable = false)
    private Workspace workspace;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // ===== Getters =====
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getContent() { return content; }
    public Workspace getWorkspace() { return workspace; }
    public User getCreatedBy() { return createdBy; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // ===== Setters =====
    public void setTitle(String title) { this.title = title; }
    public void setContent(String content) { this.content = content; }
    public void setWorkspace(Workspace workspace) { this.workspace = workspace; }
    public void setCreatedBy(User createdBy) { this.createdBy = createdBy; }
}