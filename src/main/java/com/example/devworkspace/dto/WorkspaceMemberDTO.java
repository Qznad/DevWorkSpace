package com.example.devworkspace.dto;

public class WorkspaceMemberDTO {
    private Long userId;
    private String role;       // e.g., "member", "admin"
    private String userName;   // optional, for GET responses
    private String userEmail;  // optional, for GET responses

    // Getters & Setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
}