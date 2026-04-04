package com.example.devworkspace.controller;

import com.example.devworkspace.dto.WorkspaceDto;
import com.example.devworkspace.dto.WorkspaceMemberDTO;
import com.example.devworkspace.entity.Workspace;
import com.example.devworkspace.entity.WorkspaceMember;
import com.example.devworkspace.service.WorkspaceMemberService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000") // <--- allow your React dev server
@RequestMapping("/workspaces")
public class WorkspaceMemberController {

    private final WorkspaceMemberService memberService;

    public WorkspaceMemberController(WorkspaceMemberService memberService) {
        this.memberService = memberService;
    }

    // Get all members (admin/testing)
    @GetMapping("/members")
    public ResponseEntity<List<WorkspaceMemberDTO>> getAllMembers() {
        return ResponseEntity.ok(memberService.getAllMembersDTO());
    }

    // Get members of a specific workspace
    @GetMapping("/{workspaceId}/members")
    public ResponseEntity<List<WorkspaceMemberDTO>> getWorkspaceMembers(@PathVariable Long workspaceId) {
        return ResponseEntity.ok(memberService.getWorkspaceMembersDTO(workspaceId));
    }

    // Add member to workspace (owner-only)
    @PostMapping("/{workspaceId}/members")
    public ResponseEntity<?> addMember(
            @PathVariable Long workspaceId,
            @RequestParam Long requesterId,
            @RequestBody WorkspaceMemberDTO memberDTO
    ) {
        try {
            memberService.addMemberFromDTO(workspaceId, requesterId, memberDTO);
            return ResponseEntity.ok("New member added successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    // Remove member from workspace (owner-only)
    @DeleteMapping("/{workspaceId}/members/{memberUserId}")
    public ResponseEntity<?> removeMember(
            @PathVariable Long workspaceId,
            @PathVariable Long memberUserId,
            @RequestParam Long requesterId
    ) {
        try {
            memberService.removeMember(workspaceId, memberUserId, requesterId);
            return ResponseEntity.ok("Member removed successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserWorkspaces(@PathVariable Long userId) {
        try {
            List<WorkspaceDto> workspaces = memberService.getWorkspacesForUserDTO(userId);
            return ResponseEntity.ok(workspaces);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }
}