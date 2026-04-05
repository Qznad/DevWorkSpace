package com.example.devworkspace.service;

import com.example.devworkspace.dto.WorkspaceDto;
import com.example.devworkspace.entity.User;
import com.example.devworkspace.entity.Workspace;
import com.example.devworkspace.repository.WorkspaceRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

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
        ws.getMembers().add(owner); // Owner is also a member
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

    // Get workspaces for a user (owner OR member)
    public List<WorkspaceDto> getWorkspacesForUser(Long userId) {
        return workspaceRepo.findAllByOwnerOrMemberId(userId).stream()
                .map(ws -> new WorkspaceDto(ws.getId(), ws.getName(), ws.getOwner()))
                .collect(Collectors.toList());
    }

    // Delete workspace
    public void deleteWorkspace(Long workspaceId) {
        workspaceRepo.deleteById(workspaceId);
    }
}