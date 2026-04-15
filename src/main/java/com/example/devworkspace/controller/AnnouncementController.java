package com.example.devworkspace.controller;

import com.example.devworkspace.dto.AnnouncementRequest;
import com.example.devworkspace.dto.AnnouncementResponse;
import com.example.devworkspace.service.AnnouncementService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/announcements")
@CrossOrigin(origins = "http://localhost:3000")
public class AnnouncementController {

    private final AnnouncementService announcementService;
    private final SimpMessagingTemplate messagingTemplate;

    public AnnouncementController(AnnouncementService announcementService, SimpMessagingTemplate messagingTemplate) {
        this.announcementService = announcementService;
        this.messagingTemplate = messagingTemplate;
    }

    // ---------------- Create Announcement ----------------
    @PostMapping
    public ResponseEntity<?> create(@RequestBody AnnouncementRequest request) {
        try {
            AnnouncementResponse response = announcementService.createAnnouncement(request);
            Long workspaceId = response.getWorkspaceId();
            
            // Broadcast announcement creation
            Map<String, Object> payload = new java.util.HashMap<>();
            payload.put("type", "NEW_ANNOUNCEMENT");
            payload.put("announcement", response);
            payload.put("timestamp", System.currentTimeMillis());
            
            messagingTemplate.convertAndSend(
                    "/topic/workspace/" + workspaceId + "/announcements",
                    (Object) payload
            );
            
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    // ---------------- Delete Announcement (Owner Only) ----------------
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAnnouncement(
            @PathVariable Long id,
            @RequestParam Long userId) { // temporarily pass owner's userId
        try {
            // Get announcement before deleting to get workspaceId
            AnnouncementResponse response = announcementService.getAnnouncement(id);
            Long workspaceId = response.getWorkspaceId();
            
            announcementService.deleteAnnouncement(id, userId);
            
            // Broadcast announcement deletion
            Map<String, Object> payload = new java.util.HashMap<>();
            payload.put("type", "DELETE_ANNOUNCEMENT");
            payload.put("announcementId", id);
            payload.put("timestamp", System.currentTimeMillis());
            
            messagingTemplate.convertAndSend(
                    "/topic/workspace/" + workspaceId + "/announcements",
                    (Object) payload
            );
            
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException ex) {
            // FORBIDDEN if the user is not the owner
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
    }

    // ---------------- Get All Announcements ----------------
    @GetMapping
    public List<AnnouncementResponse> getAll() {
        return announcementService.getAllAnnouncements();
    }

    // ---------------- Get Single Announcement ----------------
    @GetMapping("/{id}")
    public ResponseEntity<?> getOne(@PathVariable Long id) {
        try {
            AnnouncementResponse response = announcementService.getAnnouncement(id);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }
}