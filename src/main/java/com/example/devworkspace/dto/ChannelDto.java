package com.example.devworkspace.dto;

public class ChannelDto {
    private Long id;
    private String name;
    private Long workspaceId;

    public ChannelDto(Long id, String name, Long workspaceId) {
        this.id = id;
        this.name = name;
        this.workspaceId = workspaceId;
    }

    public ChannelDto() {
    }

    // Getters & Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getWorkspaceId() {
        return workspaceId;
    }

    public void setWorkspaceId(Long workspaceId) {
        this.workspaceId = workspaceId;
    }
}