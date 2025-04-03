package com.qslabs.sms.dto;

import com.qslabs.sms.model.User;

/**
 * Data Transfer Object for the User entity.
 * Encapsulates user data to be exchanged between the client and server,
 * without exposing internal persistence details.
 */
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private String role;
    private String password;

    /**
     * Default constructor (required for deserialization).
     */
    public UserDTO() {}

    /**
     * Parameterized constructor for quick manual creation.
     *
     * @param userId   User's ID
     * @param username Username
     * @param password Password
     * @param role     User role
     */
    public UserDTO(Long userId,String username,String password, String role) {
        this.username = username;
        this.password = password;
        this.role = role;
    }

    /**
     * Constructor to convert a User entity into a DTO.
     *
     * @param user User entity object
     */
    public UserDTO(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.password = user.getPassword();
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
