package com.example.devworkspace.dto;

import com.example.devworkspace.entity.User;

public record WorkspaceDto(
        Long id,
        String name,
        String ownerName,
        String ownerEmail
) {
    // Constructor from User entity
    public WorkspaceDto(Long id, String name, User owner) {
        this(id, name, owner.getName(), owner.getEmail());
    }
}