package com.example.devworkspace.controller;

import com.example.devworkspace.dto.WorkspaceMemberDTO;
import com.example.devworkspace.entity.WorkspaceMember;
import com.example.devworkspace.service.WorkspaceMemberService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/workspace-members")
public class WorkspaceMemberController {

    private final WorkspaceMemberService service;

    public WorkspaceMemberController(WorkspaceMemberService service) {
        this.service = service;
    }


    @PostMapping
    public ResponseEntity<?> addMember(@RequestBody WorkspaceMember member,
                                       @RequestParam Long requesterId) {
        WorkspaceMember result = service.addMember(member, requesterId);

        if (result.getId().equals(member.getId())) {
            // New member added
            return ResponseEntity.ok("New member added to workspace");
        } else {
            // User was already in workspace
            return ResponseEntity.ok("User already in workspace");
        }
    }

    @GetMapping
    public List<WorkspaceMember> getAllMembers() {
        return service.getAllMembers();
    }

    //You hit /workspace/1/members
    //
    //Spring calls getMembers()
    //
    //This method calls the service, which maps all members to DTOs
    //
    //You get a clean JSON response

    @GetMapping("/workspace/{id}/members")
    public List<WorkspaceMemberDTO> getMembers(@PathVariable Long id) {
        return service.getWorkspaceMembersDTO(id);
    }

    @DeleteMapping("/workspace/{workspaceId}/member/{userId}")
    public ResponseEntity<String> removeMember(
            @PathVariable Long workspaceId,
            @PathVariable Long userId,
            @RequestParam Long requesterId) {
        service.removeMember(workspaceId, userId, requesterId);
        return ResponseEntity.ok("Member removed successfully");
    }

}