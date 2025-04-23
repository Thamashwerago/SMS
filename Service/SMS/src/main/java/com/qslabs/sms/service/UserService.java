package com.qslabs.sms.service;

import com.qslabs.sms.dto.AuthDTO;
import com.qslabs.sms.dto.UserDTO;
import com.qslabs.sms.dto.UserResponseDTO;
import com.qslabs.sms.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * Service interface for managing users.
 * Handles operations like registration, authentication, and profile updates.
 */
public interface UserService {

    /**
     * Creates a new user with encoded password and stores it in the system.
     *
     * @param userDTO user registration data
     * @return ID of the newly created user
     */
    Long createUser(UserDTO userDTO);

    Page<UserResponseDTO> getAllUsers(Pageable pageable);

    /**
     * Validates user credentials.
     *
     * @param username the username entered during login
     * @param password the raw password to validate
     * @return role of the user if valid, otherwise "null" string
     */
    AuthDTO isUser(String username, String password);

    /**
     * Updates the username of a user by ID.
     *
     * @param id      user ID
     * @param userDTO object containing the new username
     * @return updated UserDTO
     */
    UserDTO updateUserName(Long id,UserDTO userDTO);

    /**
     * Updates the email address of a user by ID.
     *
     * @param id      user ID
     * @param userDTO object containing the new email
     * @return updated UserDTO
     */
    UserDTO updateEmail(Long id,UserDTO userDTO);

    /**
     * Updates the user's password (should be encoded before saving).
     *
     * @param id      user ID
     * @param userDTO object containing the new password
     * @return updated UserDTO
     */
    UserDTO updateUserPassword(Long id, UserDTO userDTO);

    /**
     * Updates the user's role (e.g., ADMIN, TEACHER, STUDENT).
     *
     * @param id      user ID
     * @param userDTO object containing the new role
     * @return updated UserDTO
     */
    UserDTO updateUserRole(Long id, UserDTO userDTO);

    /**
     * Deletes a user from the system by ID.
     *
     * @param id ID of the user to delete
     */
    void deleteUser(Long id);
}
