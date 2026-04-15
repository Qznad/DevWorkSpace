package com.example.devworkspace.repository;

import com.example.devworkspace.entity.File;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileRepository extends JpaRepository<File, Long> {
    List<File> findByMessageId(Long messageId);
    List<File> findByAssignmentId(Long assignmentId);
    List<File> findByUploadedById(Long userId);
}