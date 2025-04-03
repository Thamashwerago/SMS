package com.qslabs.sms.model;

import com.qslabs.sms.dto.UserDTO;
import com.qslabs.sms.util.Constants;
import jakarta.persistence.*;

/**
 * Entity class representing a user in the system.
 * Maps to the USER_TABLE in the database.
 */
@Entity
@Table(name = Constants.USER_TABLE)
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role;

    /**
     * Default constructor required by JPA.
     */
    public User() {}

    /**
     * Constructor to populate User entity from a UserDTO.
     *
     * @param userDTO DTO containing user input data
     */
    public User(UserDTO userDTO) {
        this.username = userDTO.getUsername();
        this.password = userDTO.getPassword();
        this.email = userDTO.getEmail();
        this.role = userDTO.getRole();
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
