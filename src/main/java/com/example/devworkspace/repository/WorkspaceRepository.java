package com.example.devworkspace.repository;

import com.example.devworkspace.entity.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface WorkspaceRepository extends JpaRepository<Workspace, Long> {

    // Get all workspaces where the user is owner or member
    @Query("SELECT DISTINCT w FROM Workspace w " +
            "LEFT JOIN w.members m " +
            "WHERE w.owner.id = :userId OR m.id = :userId")
    List<Workspace> findAllByOwnerOrMemberId(@Param("userId") Long userId);
}