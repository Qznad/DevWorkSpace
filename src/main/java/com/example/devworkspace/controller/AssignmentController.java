package com.example.devworkspace.controller;

import com.example.devworkspace.dto.AssignmentRequest;
import com.example.devworkspace.dto.AssignmentResponse;
import com.example.devworkspace.service.AssignmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/assignments")
@CrossOrigin(origins = "http://localhost:3000")
public class AssignmentController {

    private final AssignmentService assignmentService;
    private final SimpMessagingTemplate messagingTemplate;

    public AssignmentController(AssignmentService assignmentService, SimpMessagingTemplate messagingTemplate) {
        this.assignmentService = assignmentService;
        this.messagingTemplate = messagingTemplate;
    }

    // CREATE
    @PostMapping
    public ResponseEntity<?> create(@RequestBody AssignmentRequest request) {
        try {
            AssignmentResponse response = assignmentService.createAssignment(request);
            Long workspaceId = response.getWorkspaceId();
            
            // Broadcast assignment creation
            Map<String, Object> payload = new java.util.HashMap<>();
            payload.put("type", "NEW_ASSIGNMENT");
            payload.put("assignment", response);
            payload.put("timestamp", System.currentTimeMillis());
            
            messagingTemplate.convertAndSend(
                    "/topic/workspace/" + workspaceId + "/assignments",
                    (Object) payload
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(
            @PathVariable Long id,
            @RequestParam Long userId
    ) {
        try {
            // Get assignment before deleting to get workspaceId
            List<AssignmentResponse> allAssignments = assignmentService.getAllAssignments();
            AssignmentResponse assignmentToDelete = allAssignments.stream()
                    .filter(a -> a.getId().equals(id))
                    .findFirst()
                    .orElse(null);
            
            Long workspaceId = assignmentToDelete != null ? assignmentToDelete.getWorkspaceId() : null;
            
            assignmentService.deleteAssignment(id, userId);
            
            if (workspaceId != null) {
                // Broadcast assignment deletion
                Map<String, Object> payload = new java.util.HashMap<>();
                payload.put("type", "DELETE_ASSIGNMENT");
                payload.put("assignmentId", id);
                payload.put("timestamp", System.currentTimeMillis());
                
                messagingTemplate.convertAndSend(
                        "/topic/workspace/" + workspaceId + "/assignments",
                        (Object) payload
                );
            }
            
            return ResponseEntity.ok("Deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    // GET ALL
    @GetMapping
    public List<AssignmentResponse> getAll() {
        return assignmentService.getAllAssignments();
    }

    // GET BY WORKSPACE
    @GetMapping("/workspace/{workspaceId}")
    public List<AssignmentResponse> getByWorkspace(@PathVariable Long workspaceId) {
        return assignmentService.getByWorkspace(workspaceId);
    }
}