package com.example.devworkspace.controller;

import com.example.devworkspace.dto.UserRequestDto;
import com.example.devworkspace.dto.UserResponseDto;
import com.example.devworkspace.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000") // React dev server
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserRequestDto userDto) {
        try {
            UserResponseDto response = userService.registerUser(userDto);
            return ResponseEntity.ok(response); // 200 OK with user info
        } catch (RuntimeException ex) {
            // Return 400 Bad Request with JSON message
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", ex.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody UserRequestDto userDto) {
        try {
            UserResponseDto response = userService.loginUser(userDto.getEmail(), userDto.getPassword());
            return ResponseEntity.ok(response); // 200 OK with user info
        } catch (RuntimeException ex) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", ex.getMessage()));
        }
    }
}