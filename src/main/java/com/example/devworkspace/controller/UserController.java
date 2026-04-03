package com.example.devworkspace.controller;

import com.example.devworkspace.dto.UserRequestDto;
import com.example.devworkspace.dto.UserResponseDto;
import com.example.devworkspace.entity.User;
import com.example.devworkspace.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public UserResponseDto registerUser(@RequestBody UserRequestDto userDto) {
        return userService.registerUser(userDto);
    }

    @PostMapping("/login")
    public UserResponseDto loginUser(@RequestBody UserRequestDto userDto) {
        return userService.loginUser(userDto.getEmail(), userDto.getPassword());
    }
    @GetMapping("/users")
    public List<UserResponseDto> getAllUsers() {
        return userService.getAllUsers();
    }
}