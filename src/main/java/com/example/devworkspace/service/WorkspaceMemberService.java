package com.example.devworkspace.service;

import com.example.devworkspace.dto.WorkspaceDto;
import com.example.devworkspace.dto.WorkspaceMemberDTO;
import com.example.devworkspace.entity.User;
import com.example.devworkspace.entity.Workspace;
import com.example.devworkspace.entity.WorkspaceMember;
import com.example.devworkspace.repository.UserRepository;
import com.example.devworkspace.repository.WorkspaceMemberRepository;
import com.example.devworkspace.repository.WorkspaceRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WorkspaceMemberService {

    private final WorkspaceMemberRepository memberRepo;
    private final WorkspaceRepository workspaceRepo;
    private final UserRepository userRepo;

    public WorkspaceMemberService(WorkspaceMemberRepository memberRepo,
                                  WorkspaceRepository workspaceRepo,
                                  UserRepository userRepo) {
        this.memberRepo = memberRepo;
        this.workspaceRepo = workspaceRepo;
        this.userRepo = userRepo;
    }

    // Convert WorkspaceMember to DTO
    private WorkspaceMemberDTO toDTO(WorkspaceMember member) {
        WorkspaceMemberDTO dto = new WorkspaceMemberDTO();
        dto.setUserId(member.getUser().getId());
        dto.setRole(member.getRole());
        dto.setUserName(member.getUser().getName());
        dto.setUserEmail(member.getUser().getEmail());
        return dto;
    }

    // Get members of a workspace
    public List<WorkspaceMemberDTO> getWorkspaceMembersDTO(Long workspaceId) {
        return memberRepo.findByWorkspaceId(workspaceId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // Add member by email
    public WorkspaceMemberDTO addMemberByEmail(Long workspaceId, Long requesterId, String email, String role) {
        Workspace workspace = workspaceRepo.findById(workspaceId)
                .orElseThrow(() -> new RuntimeException("Workspace not found"));

        User requester = userRepo.findById(requesterId)
                .orElseThrow(() -> new RuntimeException("Requester not found"));

        if (!workspace.getOwner().getId().equals(requester.getId())) {
            throw new RuntimeException("Only workspace owner can add members");
        }

        User userToAdd = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        if (memberRepo.existsByWorkspaceAndUser(workspace, userToAdd)) {
            throw new RuntimeException("User is already a member of this workspace");
        }

        WorkspaceMember member = new WorkspaceMember();
        member.setWorkspace(workspace);
        member.setUser(userToAdd);
        member.setRole(role != null && !role.isEmpty() ? role : "member");

        WorkspaceMember savedMember = memberRepo.save(member);

        System.out.println("Added member: " + userToAdd.getEmail() + " to workspace: " + workspace.getName());

        return toDTO(savedMember);
    }

    // Remove member
    public void removeMember(Long workspaceId, Long memberUserId, Long requesterId) {
        Workspace workspace = workspaceRepo.findById(workspaceId)
                .orElseThrow(() -> new RuntimeException("Workspace not found"));

        User requester = userRepo.findById(requesterId)
                .orElseThrow(() -> new RuntimeException("Requester not found"));

        if (!workspace.getOwner().getId().equals(requester.getId())) {
            throw new RuntimeException("Only workspace owner can remove members");
        }

        WorkspaceMember member = memberRepo.findByUserIdAndWorkspaceId(memberUserId, workspaceId)
                .orElseThrow(() -> new RuntimeException("Member not found in this workspace"));

        memberRepo.delete(member);
        System.out.println("Removed member: " + memberUserId + " from workspace: " + workspace.getName());
    }
}