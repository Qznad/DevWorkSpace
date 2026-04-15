package com.example.devworkspace.controller;

import com.example.devworkspace.entity.File;
import com.example.devworkspace.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/files")
public class FileController {

    @Autowired
    private FileService fileService;

    @PostMapping
    public File upload(@RequestBody File file) {
        return fileService.uploadFile(file);
    }

    @GetMapping
    public List<File> getAll() {
        return fileService.getAllFiles();
    }

    @GetMapping("/message/{messageId}")
    public List<File> getByMessage(@PathVariable Long messageId) {
        return fileService.getFilesByMessage(messageId);
    }

    @GetMapping("/assignment/{assignmentId}")
    public List<File> getByAssignment(@PathVariable Long assignmentId) {
        return fileService.getFilesByAssignment(assignmentId);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        fileService.deleteFile(id);
    }
}