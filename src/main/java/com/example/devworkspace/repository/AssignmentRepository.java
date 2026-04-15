package com.example.devworkspace.repository;

import com.example.devworkspace.entity.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    List<Assignment> findByWorkspaceId(Long workspaceId);
}