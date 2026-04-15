package com.example.devworkspace.service;

import com.example.devworkspace.entity.File;
import com.example.devworkspace.repository.FileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FileService {

    @Autowired
    private FileRepository fileRepository;

    public File uploadFile(File file) {
        return fileRepository.save(file);
    }

    public List<File> getAllFiles() {
        return fileRepository.findAll();
    }

    public List<File> getFilesByMessage(Long messageId) {
        return fileRepository.findByMessageId(messageId);
    }

    public List<File> getFilesByAssignment(Long assignmentId) {
        return fileRepository.findByAssignmentId(assignmentId);
    }

    public void deleteFile(Long id) {
        fileRepository.deleteById(id);
    }
}