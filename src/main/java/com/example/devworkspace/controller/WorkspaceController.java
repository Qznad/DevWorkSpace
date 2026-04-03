package com.example.devworkspace.controller;

import com.example.devworkspace.entity.User;
import com.example.devworkspace.entity.Workspace;
import com.example.devworkspace.service.UserService;
import com.example.devworkspace.service.WorkspaceService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/workspaces")
public class WorkspaceController {

    private final WorkspaceService workspaceService;
    private final UserService userService; // to get user by ID or email

    public WorkspaceController(WorkspaceService workspaceService, UserService userService) {
        this.workspaceService = workspaceService;
        this.userService = userService;
    }

    // Create a workspace (the creator becomes the owner/admin)
    @PostMapping
    public Workspace createWorkspace(@RequestParam Long ownerId, @RequestParam String name) {
        User owner = userService.getUserById(ownerId); // fetch user
        return workspaceService.createWorkspace(owner, name);
    }

    // Get all workspaces
    @GetMapping
    public List<Workspace> getAllWorkspaces() {
        return workspaceService.getAllWorkspaces();
    }

    // Get a single workspace by ID
    @GetMapping("/{id}")
    public Workspace getWorkspace(@PathVariable Long id) {
        return workspaceService.getWorkspaceById(id);
    }
}