package com.example.devworkspace.controller;

import com.example.devworkspace.dto.WorkspaceDto;
import com.example.devworkspace.dto.WorkspaceMemberDTO;
import com.example.devworkspace.entity.User;
import com.example.devworkspace.service.WorkspaceMemberService;
import com.example.devworkspace.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/workspaces")
public class WorkspaceMemberController {

    private final WorkspaceMemberService memberService;
    private final SimpMessagingTemplate messagingTemplate;

    public WorkspaceMemberController(WorkspaceMemberService memberService, SimpMessagingTemplate messagingTemplate) {
        this.memberService = memberService;
        this.messagingTemplate = messagingTemplate;
    }

    // Remove member
    @DeleteMapping("/{workspaceId}/members/{memberUserId}")
    public ResponseEntity<?> removeMember(
            @PathVariable Long workspaceId,
            @PathVariable Long memberUserId,
            @RequestParam Long requesterId
    ) {
        try {
            memberService.removeMember(workspaceId, memberUserId, requesterId);
            
            // Broadcast member removal
            Map<String, Object> payload = new java.util.HashMap<>();
            payload.put("type", "MEMBER_LEFT");
            payload.put("memberId", memberUserId);
            payload.put("userId", memberUserId);
            payload.put("timestamp", System.currentTimeMillis());
            
            messagingTemplate.convertAndSend(
                    "/topic/workspace/" + workspaceId + "/members",
                    (Object) payload
            );
            
            return ResponseEntity.ok("Member removed successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    // Add member to workspace (owner only)
    @PostMapping("/{workspaceId}/members")
    public ResponseEntity<?> addMember(
            @PathVariable Long workspaceId,
            @RequestBody AddMemberRequest request
    ) {
        try {
            System.out.println("Request to add member: " + request.getEmail() + " by requester: " + request.getRequesterId());
            WorkspaceMemberDTO newMember = memberService.addMemberByEmail(
                    workspaceId,
                    request.getRequesterId(),
                    request.getEmail(),
                    request.getRole()
            );
            
            // Broadcast member join
            Map<String, Object> payload = new java.util.HashMap<>();
            payload.put("type", "MEMBER_JOINED");
            payload.put("member", newMember);
            payload.put("timestamp", System.currentTimeMillis());
            
            messagingTemplate.convertAndSend(
                    "/topic/workspace/" + workspaceId + "/members",
                    (Object) payload
            );
            
            return ResponseEntity.ok(newMember);
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    // Get members of a workspace
    @GetMapping("/{workspaceId}/members")
    public ResponseEntity<List<WorkspaceMemberDTO>> getWorkspaceMembers(@PathVariable Long workspaceId) {
        return ResponseEntity.ok(memberService.getWorkspaceMembersDTO(workspaceId));
    }

    // DTO for POST request
    public static class AddMemberRequest {
        private Long requesterId;
        private String email;
        private String role; // optional

        // getters and setters
        public Long getRequesterId() { return requesterId; }
        public void setRequesterId(Long requesterId) { this.requesterId = requesterId; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
    }
}