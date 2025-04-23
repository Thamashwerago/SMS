// src/main/java/com/qslabs/sms/dto/UserResponseDTO.java
package com.qslabs.sms.dto;

import com.qslabs.sms.model.User;

/**
 * Secure response-only DTO that excludes password from serialization.
 */
public class UserResponseDTO {
    private Long id;
    private String username;
    private String email;
    private String role;

    public UserResponseDTO() {}

    public UserResponseDTO(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.role = user.getRole();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
