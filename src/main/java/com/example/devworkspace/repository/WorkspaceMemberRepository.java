package com.example.devworkspace.repository;

import com.example.devworkspace.entity.WorkspaceMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WorkspaceMemberRepository extends JpaRepository<WorkspaceMember, Long> {
    boolean existsByUserIdAndWorkspaceId(Long id, Long id1);

    Optional<WorkspaceMember> findByUserIdAndWorkspaceId(Long userId, Long workspaceId);

    List<WorkspaceMember> findByWorkspaceId(Long workspaceId);
    List<WorkspaceMember> findAllByWorkspaceId(Long workspaceId);
}