package com.example.devworkspace.service;

import com.example.devworkspace.entity.User;
import com.example.devworkspace.entity.Workspace;
import com.example.devworkspace.entity.WorkspaceMember;
import com.example.devworkspace.repository.WorkspaceMemberRepository;
import com.example.devworkspace.repository.WorkspaceRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class WorkspaceService {

    private final WorkspaceRepository workspaceRepository;
    private final WorkspaceMemberRepository workspaceMemberRepository;

    public WorkspaceService(WorkspaceRepository workspaceRepository,
                            WorkspaceMemberRepository workspaceMemberRepository) {
        this.workspaceRepository = workspaceRepository;
        this.workspaceMemberRepository = workspaceMemberRepository;
    }

    // Create a workspace and assign the owner as admin
    public Workspace createWorkspace(User owner, String name) {
        Workspace workspace = new Workspace();
        workspace.setName(name);
        workspace.setOwner(owner);
        workspace.setCreatedAt(LocalDateTime.now());

        // Save the workspace
        Workspace savedWorkspace = workspaceRepository.save(workspace);

        // Add the owner as a member with role 'owner'
        WorkspaceMember ownerMember = new WorkspaceMember();
        ownerMember.setUser(owner);
        ownerMember.setWorkspace(savedWorkspace);
        ownerMember.setRole("owner");
        ownerMember.setJoinedAt(LocalDateTime.now());

        workspaceMemberRepository.save(ownerMember);

        return savedWorkspace;
    }

    // List all workspaces
    public List<Workspace> getAllWorkspaces() {
        return workspaceRepository.findAll();
    }

    // Get workspace by ID
    public Workspace getWorkspaceById(Long id) {
        return workspaceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Workspace not found"));
    }
}