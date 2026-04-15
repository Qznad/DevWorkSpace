package com.example.devworkspace.service;

import com.example.devworkspace.dto.AssignmentRequest;
import com.example.devworkspace.dto.AssignmentResponse;
import com.example.devworkspace.entity.Assignment;
import com.example.devworkspace.entity.User;
import com.example.devworkspace.entity.Workspace;
import com.example.devworkspace.repository.AssignmentRepository;
import com.example.devworkspace.repository.UserRepository;
import com.example.devworkspace.repository.WorkspaceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final WorkspaceRepository workspaceRepository;
    private final UserRepository userRepository;

    public AssignmentService(AssignmentRepository assignmentRepository,
                             WorkspaceRepository workspaceRepository,
                             UserRepository userRepository) {
        this.assignmentRepository = assignmentRepository;
        this.workspaceRepository = workspaceRepository;
        this.userRepository = userRepository;
    }

    // CREATE
    @Transactional
    public AssignmentResponse createAssignment(AssignmentRequest request) {
        Workspace workspace = workspaceRepository.findById(request.getWorkspaceId())
                .orElseThrow(() -> new IllegalArgumentException("Workspace not found"));

        User user = userRepository.findById(request.getCreatedById())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Assignment assignment = new Assignment();
        assignment.setTitle(request.getTitle());
        assignment.setDescription(request.getDescription());
        assignment.setDueDate(request.getDueDate());
        assignment.setWorkspace(workspace);
        assignment.setCreatedBy(user);

        Assignment saved = assignmentRepository.save(assignment);

        return mapToResponse(saved);
    }

    // GET ALL
    public List<AssignmentResponse> getAllAssignments() {
        return assignmentRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // GET BY WORKSPACE
    public List<AssignmentResponse> getByWorkspace(Long workspaceId) {
        return assignmentRepository.findByWorkspaceId(workspaceId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // DELETE (owner only like announcements)
    @Transactional
    public void deleteAssignment(Long assignmentId, Long userId) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new IllegalArgumentException("Assignment not found"));

        Long ownerId = assignment.getWorkspace().getOwner().getId();

        if (!ownerId.equals(userId)) {
            throw new IllegalArgumentException("Only workspace owner can delete this assignment");
        }

        assignmentRepository.delete(assignment);
    }

    // MAPPER
    private AssignmentResponse mapToResponse(Assignment assignment) {
        return new AssignmentResponse(
                assignment.getId(),
                assignment.getTitle(),
                assignment.getDescription(),
                assignment.getDueDate(),
                assignment.getWorkspace().getId(),
                assignment.getCreatedBy().getId(),
                assignment.getCreatedAt()
        );
    }
}