package com.example.devworkspace.repository;

import com.example.devworkspace.entity.User;
import com.example.devworkspace.entity.Workspace;
import com.example.devworkspace.entity.WorkspaceMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

public interface WorkspaceMemberRepository extends JpaRepository<WorkspaceMember, Long> {

    // Check if a user is already a member of a workspace (by IDs)
    boolean existsByUserIdAndWorkspaceId(Long userId, Long workspaceId);

    // Check if a user is already a member of a workspace (by entities)
    boolean existsByUserAndWorkspace(User user, Workspace workspace);

    // Your original method, same as above just parameter order swapped
    boolean existsByWorkspaceAndUser(Workspace workspace, User user);

    // Find a specific member by user and workspace
    Optional<WorkspaceMember> findByUserIdAndWorkspaceId(Long userId, Long workspaceId);

    // Optional: find a member by entities
    Optional<WorkspaceMember> findByUserAndWorkspace(User user, Workspace workspace);

    // Get all members of a workspace
    List<WorkspaceMember> findByWorkspaceId(Long workspaceId);
    // Get all workspace memberships for a specific user
    List<WorkspaceMember> findByUserId(Long userId);
}