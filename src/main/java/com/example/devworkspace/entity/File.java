package com.example.devworkspace.entity;

import com.example.devworkspace.entity.Assignment;
import com.example.devworkspace.entity.Message;
import com.example.devworkspace.entity.User;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "files")
public class File {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String filename;
    private String fileUrl;

    @ManyToOne
    @JoinColumn(name = "uploaded_by")
    private User uploadedBy;

    @ManyToOne
    @JoinColumn(name = "message_id")
    private Message message;

    @ManyToOne
    @JoinColumn(name = "assignment_id")
    private Assignment assignment;

    private LocalDateTime createdAt = LocalDateTime.now();
}