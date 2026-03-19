package com.example.devworkspace.service;

import com.example.devworkspace.dto.WorkspaceMemberDTO;
import com.example.devworkspace.entity.Workspace;
import com.example.devworkspace.entity.WorkspaceMember;
import com.example.devworkspace.repository.WorkspaceMemberRepository;
import com.example.devworkspace.repository.WorkspaceRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WorkspaceMemberService {

    private final WorkspaceMemberRepository memberRepository;
    private final WorkspaceRepository workspaceRepository;

    public WorkspaceMemberService(WorkspaceMemberRepository memberRepository,
                                  WorkspaceRepository workspaceRepository) {
        this.memberRepository = memberRepository;
        this.workspaceRepository = workspaceRepository;
    }

    // Add member to workspace (owner-only)
    public WorkspaceMember addMember(WorkspaceMember member, Long requesterId) {
        // Load workspace from DB
        Workspace workspace = workspaceRepository.findById(member.getWorkspace().getId())
                .orElseThrow(() -> new RuntimeException("Workspace not found"));

        // Check if requester is owner
        if (!workspace.getOwner().getId().equals(requesterId)) {
            throw new RuntimeException("Only owner can add members");
        }

        // Check if user already in workspace
        Optional<WorkspaceMember> existingOpt = memberRepository
                .findByUserIdAndWorkspaceId(member.getUser().getId(), workspace.getId());

        return existingOpt.orElseGet(() -> {
            member.setWorkspace(workspace); // ensure workspace is set
            return memberRepository.save(member);
        });
    }

    // Get all workspace members (raw entities)
    public List<WorkspaceMember> getAllMembers() {
        return memberRepository.findAll();
    }

    // Get members for a specific workspace (raw entities)
    public List<WorkspaceMember> getMembersByWorkspace(Long workspaceId) {
        return memberRepository.findByWorkspaceId(workspaceId);
    }

    // Get members for a workspace mapped to DTOs (clean JSON)
    public List<WorkspaceMemberDTO> getWorkspaceMembersDTO(Long workspaceId) {
        return memberRepository.findAllByWorkspaceId(workspaceId)
                .stream()
                .map(member -> new WorkspaceMemberDTO(
                        member.getUser().getName(),
                        member.getUser().getEmail(),
                        member.getRole(),
                        member.getWorkspace().getName()
                ))
                .toList();
    }

    // Remove member from workspace (owner-only)
    public void removeMember(Long workspaceId, Long memberId, Long requesterId) {
        // Step 1: Check if requester is the workspace owner
        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new RuntimeException("Workspace not found"));

        if (!workspace.getOwner().getId().equals(requesterId)) {
            throw new RuntimeException("Only the workspace owner can remove members");
        }

        // Step 2: Find member to remove
        WorkspaceMember member = memberRepository
                .findByUserIdAndWorkspaceId(memberId, workspaceId)
                .orElseThrow(() -> new RuntimeException("Member not found in workspace"));

        // Step 3: Delete member
        memberRepository.delete(member);
    }
}