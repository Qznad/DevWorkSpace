package com.example.devworkspace.dto;

//DTO = Data Transfer Object.
//
//Think of it as a simplified version of your data that you send to the client (like Postman, browser, or frontend).
//
//Why use it?
//
//Your entity objects (like User or WorkspaceMember) often contain sensitive info, like passwords.
//
//Sometimes your entities are nested, which makes JSON very messy.
//
//DTOs let you pick only the fields you need and shape the data for the client.

public class WorkspaceMemberDTO {
    private String userName;
    private String userEmail;
    private String role;
    private String workspaceName;

    public WorkspaceMemberDTO(String userName, String userEmail, String role, String workspaceName) {
        this.userName = userName;
        this.userEmail = userEmail;
        this.role = role;
        this.workspaceName = workspaceName;
    }

    // Getters and setters
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getWorkspaceName() { return workspaceName; }
    public void setWorkspaceName(String workspaceName) { this.workspaceName = workspaceName; }
}