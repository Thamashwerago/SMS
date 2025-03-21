package com.qslabs.sms.dto;

public class UserDTO {
    private String username;
    private String role;

    // Default Constructor
    public UserDTO() {}

    // Parameterized Constructor
    public UserDTO(String username, String role) {
        this.username = username;
        this.role = role;
    }

    // Getters and Setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
