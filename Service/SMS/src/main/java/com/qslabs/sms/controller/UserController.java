package com.qslabs.sms.controller;

import com.qslabs.sms.dto.UserDTO;
import com.qslabs.sms.service.UserService;
import com.qslabs.sms.util.Constants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

/**
 * Controller for managing user-related operations like registration, login, and profile updates.
 */
@RestController
@RequestMapping(Constants.REQUEST_MAPPING_USER)
public class UserController {

    @Autowired
    private UserService userService;

    /**
     * Registers a new user.
     *
     * @param userDTO User details (username, password, etc.)
     * @return ID of the created user
     */
    @PostMapping("/signin")
    public ResponseEntity<Long> registerUser(@RequestBody UserDTO userDTO) {
        return ResponseEntity.ok(userService.createUser(userDTO));
    }

    /**
     * Authenticates a user based on username and password.
     *
     * @param userDTO Contains username and password
     * @return Success message or token
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserDTO userDTO) {
        return ResponseEntity.ok(userService.isUser(userDTO.getUsername(), userDTO.getPassword()));
    }

    /**
     * Updates a user's username by ID.
     *
     * @param id      ID of the user
     * @param userDTO DTO containing the new username
     * @return Updated UserDTO
     */
    @PostMapping("/username")
    public ResponseEntity<UserDTO> updateUser(@RequestParam Long id,@RequestBody UserDTO userDTO) {
        return ResponseEntity.ok(userService.updateUserName(id,userDTO));
    }

    /**
     * Updates a user's password by ID.
     *
     * @param id      ID of the user
     * @param userDTO DTO containing the new password
     * @return Updated UserDTO
     */
    @PostMapping("/password")
    public ResponseEntity<UserDTO> updatePassword(@RequestParam Long id,@RequestBody UserDTO userDTO) {
        return ResponseEntity.ok(userService.updateUserPassword(id,userDTO));
    }

    /**
     * Updates a user's role.
     * Only accessible by users with ROLE_ADMIN.
     *
     * @param id      ID of the user
     * @param userDTO DTO containing the new role
     * @return Updated UserDTO
     */
    @Secured("ROLE_ADMIN")
    @PostMapping("/role")
    public ResponseEntity<UserDTO> updateRole(@RequestParam Long id,@RequestBody UserDTO userDTO) {
        return ResponseEntity.ok(userService.updateUserRole(id,userDTO));
    }

    /**
     * Deletes a user by ID.
     * Only accessible by users with ROLE_ADMIN.
     *
     * @param id ID of the user to delete
     * @return HTTP 200 OK on successful deletion
     */
    @Secured("ROLE_ADMIN")
    @DeleteMapping()
    public ResponseEntity<Void> deleteUser(@RequestParam Long id){
        userService.deleteUser(id);
        return ResponseEntity.ok().build();
    }
}
