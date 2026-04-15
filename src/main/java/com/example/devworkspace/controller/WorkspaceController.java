package com.example.devworkspace.controller;

import com.example.devworkspace.dto.WorkspaceDto;
import com.example.devworkspace.dto.WorkspaceMemberDTO;
import com.example.devworkspace.entity.User;
import com.example.devworkspace.entity.Workspace;
import com.example.devworkspace.service.UserService;
import com.example.devworkspace.service.WorkspaceMemberService;
import com.example.devworkspace.service.WorkspaceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/workspaces")
@CrossOrigin(origins = "http://localhost:3000")
public class WorkspaceController {

    private final WorkspaceService workspaceService;
    private final UserService userService;
    private final WorkspaceMemberService memberService;

    public WorkspaceController(WorkspaceService workspaceService,
                               UserService userService,
                               WorkspaceMemberService memberService) {
        this.workspaceService = workspaceService;
        this.userService = userService;
        this.memberService = memberService;
    }

    // ----------------------------
    // Create workspace
    // ----------------------------
    @PostMapping
    public WorkspaceDto createWorkspace(@RequestParam Long ownerId, @RequestParam String name) {
        User owner = userService.getUserById(ownerId);
        Workspace ws = workspaceService.createWorkspace(owner, name);
        return new WorkspaceDto(ws.getId(), ws.getName(), owner);
    }

    // ----------------------------
    // Delete workspace (owner only)
    // ----------------------------
    @DeleteMapping("/{workspaceId}")
    public ResponseEntity<String> deleteWorkspace(
            @PathVariable Long workspaceId,
            @RequestParam Long userId) {

        User user = userService.getUserById(userId);
        Workspace ws = workspaceService.getWorkspaceById(workspaceId);

        if (!ws.getOwner().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body("Only owner can delete this workspace");
        }

        workspaceService.deleteWorkspace(workspaceId);
        return ResponseEntity.ok("Workspace deleted successfully");
    }

    // ----------------------------
    // Get all workspaces (DTO)
    // ----------------------------
    @GetMapping
    public List<WorkspaceDto> getAllWorkspaces() {
        return workspaceService.getAllWorkspaces()
                .stream()
                .map(ws -> new WorkspaceDto(ws.getId(), ws.getName(), ws.getOwner()))
                .collect(Collectors.toList());
    }

    // ----------------------------
    // Get workspace by ID (DTO)
    // ----------------------------
    @GetMapping("/{id}")
    public WorkspaceDto getWorkspace(@PathVariable Long id) {
        Workspace ws = workspaceService.getWorkspaceById(id);
        return new WorkspaceDto(ws.getId(), ws.getName(), ws.getOwner());
    }

    // ----------------------------
    // Get workspaces for a user (DTO)
    // ----------------------------
    @GetMapping("/userworkspaces/{userId}")
    public List<WorkspaceDto> getUserWorkspaces(@PathVariable Long userId) {
        return workspaceService.getWorkspacesForUser(userId);
    }
}