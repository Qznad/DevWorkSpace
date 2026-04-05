package com.example.devworkspace.controller;

import com.example.devworkspace.dto.WorkspaceDto;
import com.example.devworkspace.entity.User;
import com.example.devworkspace.entity.Workspace;
import com.example.devworkspace.service.UserService;
import com.example.devworkspace.service.WorkspaceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/workspaces")
public class WorkspaceController {

    private final WorkspaceService workspaceService;
    private final UserService userService;

    public WorkspaceController(WorkspaceService workspaceService, UserService userService) {
        this.workspaceService = workspaceService;
        this.userService = userService;
    }

    // Create workspace
    @PostMapping
    public Workspace createWorkspace(@RequestParam Long ownerId, @RequestParam String name) {
        User owner = userService.getUserById(ownerId);
        return workspaceService.createWorkspace(owner, name);
    }

    // Inside WorkspaceController.java

    // Delete workspace (owner only)
    @DeleteMapping("/{workspaceId}")
    public ResponseEntity<String> deleteWorkspace(
            @PathVariable Long workspaceId,
            @RequestParam Long userId) {

        User user = userService.getUserById(userId);           // get requesting user
        Workspace ws = workspaceService.getWorkspaceById(workspaceId);

        if (!ws.getOwner().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body("Only owner can delete this workspace");
        }

        workspaceService.deleteWorkspace(workspaceId);
        return ResponseEntity.ok("Workspace deleted successfully");
    }

    // Get all workspaces
    @GetMapping
    public List<Workspace> getAllWorkspaces() {
        return workspaceService.getAllWorkspaces();
    }

    // Get workspace by ID
    @GetMapping("/{id}")
    public Workspace getWorkspace(@PathVariable Long id) {
        return workspaceService.getWorkspaceById(id);
    }

    // Get workspaces for a user (DTO)
    @GetMapping("/userworkspaces/{userId}")
    public List<WorkspaceDto> getUserWorkspaces(@PathVariable Long userId) {
        return workspaceService.getWorkspacesForUser(userId);
    }
}