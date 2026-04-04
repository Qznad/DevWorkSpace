package com.example.devworkspace.service;

import com.example.devworkspace.dto.WorkspaceDto;
import com.example.devworkspace.entity.User;
import com.example.devworkspace.entity.Workspace;
import com.example.devworkspace.repository.WorkspaceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WorkspaceService {

    private final WorkspaceRepository workspaceRepo;

    public WorkspaceService(WorkspaceRepository workspaceRepo) {
        this.workspaceRepo = workspaceRepo;
    }

    // Create workspace
    public Workspace createWorkspace(User owner, String name) {
        Workspace ws = new Workspace();
        ws.setOwner(owner);
        ws.setName(name);
        return workspaceRepo.save(ws);
    }

    // Get all workspaces
    public List<Workspace> getAllWorkspaces() {
        return workspaceRepo.findAll();
    }

    // Get workspace by ID
    public Workspace getWorkspaceById(Long id) {
        return workspaceRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Workspace not found"));
    }

    // Get workspaces for a user (owner only for now)
    public List<WorkspaceDto> getWorkspacesForUser(Long userId) {
        return workspaceRepo.findAll().stream()
                .filter(ws -> ws.getOwner().getId().equals(userId))
                .map(ws -> new WorkspaceDto(ws.getId(), ws.getName(), ws.getOwner()))
                .toList();
    }
}