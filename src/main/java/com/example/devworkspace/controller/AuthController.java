package com.example.devworkspace.controller;

import com.example.devworkspace.dto.UserRequestDto;
import com.example.devworkspace.dto.UserResponseDto;
import com.example.devworkspace.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.regex.Pattern;

@CrossOrigin(origins = "http://localhost:3000") // React dev server
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private UserService userService;

    // Email validation regex pattern
    private static final Pattern EMAIL_PATTERN = 
        Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserRequestDto userDto) {
        try {
            // Validate input
            if (userDto.getName() == null || userDto.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Name is required"));
            }
            if (userDto.getEmail() == null || userDto.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Email is required"));
            }
            if (!EMAIL_PATTERN.matcher(userDto.getEmail()).matches()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Invalid email format"));
            }
            if (userDto.getPassword() == null || userDto.getPassword().length() < 8) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Password must be at least 8 characters"));
            }
            
            UserResponseDto response = userService.registerUser(userDto);
            return ResponseEntity.ok(response); // 200 OK with user info
        } catch (RuntimeException ex) {
            // Return 400 Bad Request with JSON message
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", ex.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody UserRequestDto userDto) {
        try {
            // Validate input
            if (userDto.getEmail() == null || userDto.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Email is required"));
            }
            if (userDto.getPassword() == null || userDto.getPassword().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Password is required"));
            }
            
            UserResponseDto response = userService.loginUser(userDto.getEmail(), userDto.getPassword());
            return ResponseEntity.ok(response); // 200 OK with user info
        } catch (RuntimeException ex) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", ex.getMessage()));
        }
    }
}