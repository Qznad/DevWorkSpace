package com.example.devworkspace.service;

import com.example.devworkspace.dto.AnnouncementRequest;
import com.example.devworkspace.dto.AnnouncementResponse;
import com.example.devworkspace.entity.Announcement;
import com.example.devworkspace.entity.User;
import com.example.devworkspace.entity.Workspace;
import com.example.devworkspace.repository.AnnouncementRepository;
import com.example.devworkspace.repository.UserRepository;
import com.example.devworkspace.repository.WorkspaceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;
    private final WorkspaceRepository workspaceRepository;
    private final UserRepository userRepository;

    public AnnouncementService(AnnouncementRepository announcementRepository,
                               WorkspaceRepository workspaceRepository,
                               UserRepository userRepository) {
        this.announcementRepository = announcementRepository;
        this.workspaceRepository = workspaceRepository;
        this.userRepository = userRepository;
    }

    // ---------------- Create ----------------
    @Transactional
    public AnnouncementResponse createAnnouncement(AnnouncementRequest request) {
        Workspace workspace = workspaceRepository.findById(request.getWorkspaceId())
                .orElseThrow(() -> new IllegalArgumentException("Workspace not found"));

        User user = userRepository.findById(request.getCreatedById())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Announcement announcement = new Announcement();
        announcement.setTitle(request.getTitle());
        announcement.setContent(request.getContent());
        announcement.setWorkspace(workspace);
        announcement.setCreatedBy(user);

        Announcement saved = announcementRepository.save(announcement);

        return mapToResponse(saved);
    }

    // ---------------- Get All ----------------
    @Transactional(readOnly = true)
    public List<AnnouncementResponse> getAllAnnouncements() {
        List<Announcement> announcements = announcementRepository.findAll();
        return announcements.stream()
                .map(this::mapToResponse)
                .toList();
    }

    // ---------------- Get One ----------------
    @Transactional(readOnly = true)
    public AnnouncementResponse getAnnouncement(Long id) {
        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Announcement not found"));
        return mapToResponse(announcement);
    }

    // ---------------- Delete (Owner Only) ----------------
    @Transactional
    public void deleteAnnouncement(Long announcementId, Long userId) {
        // Fetch announcement + workspace + owner in one query
        Announcement announcement = announcementRepository.findByIdWithWorkspaceOwner(announcementId)
                .orElseThrow(() -> new IllegalArgumentException("Announcement not found with id: " + announcementId));

        Long ownerId = announcement.getWorkspace().getOwner().getId();

        if (!userId.equals(ownerId)) {
            throw new IllegalArgumentException("Only the workspace owner can delete this announcement.");
        }

        announcementRepository.delete(announcement);
    }

    // ---------------- Mapper ----------------
    private AnnouncementResponse mapToResponse(Announcement announcement) {
        return new AnnouncementResponse(
                announcement.getId(),
                announcement.getTitle(),
                announcement.getContent(),
                announcement.getWorkspace().getId(),
                announcement.getCreatedBy().getId(),
                announcement.getCreatedAt()
        );
    }
}