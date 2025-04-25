package com.qslabs.sms.service.impl;

import com.qslabs.sms.dto.AuthDTO;
import com.qslabs.sms.dto.UserDTO;
import com.qslabs.sms.dto.UserResponseDTO;
import com.qslabs.sms.model.User;
import com.qslabs.sms.repository.UserRepository;
import com.qslabs.sms.service.UserService;
import com.qslabs.sms.service.impl.RedisTokenService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.UUID;

/**
 * Implementation of the UserService interface.
 * Contains user management logic such as registration, authentication, and profile updates.
 */
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private RedisTokenService redisTokenService;

    /**
     * Creates a new user and saves it to the database with an encoded password.
     *
     * @param userDTO the new user's data
     * @return the newly created user's ID
     */
    @Override
    public Long createUser(UserDTO userDTO) {
        userDTO.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        User newUser = new User(userDTO);
        newUser = userRepository.save(newUser);
        return Long.valueOf(newUser.getId());
    }

    @Override
    public Page<UserResponseDTO> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(UserResponseDTO::new);
    }

    /**
     * Validates user login credentials and generates a session token.
     *
     * @param username the user's username
     * @param password the user's raw password
     * @return AuthDTO with token and user info if authenticated, otherwise null fields
     */
    @Override
    public AuthDTO isUser(String username, String password) {
        try {
            // Authenticate using raw credentials
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );

            // Set security context
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Load user from DB to generate token
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

            // Generate token and store in Redis
            String token = UUID.randomUUID().toString();
            redisTokenService.saveToken(token, user.getUsername(), user.getId(), user.getRole());

            return new AuthDTO(token, user.getUsername(), user.getId(), user.getRole());

        }finally {

        }
    }

    @Override
    public UserDTO updateUserName(Long id, UserDTO userDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        user.setUsername(userDTO.getUsername());
        user = userRepository.save(user);
        return new UserDTO(user);
    }

    @Override
    public UserDTO updateEmail(Long id, UserDTO userDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        user.setEmail(userDTO.getEmail());
        user = userRepository.save(user);
        return new UserDTO(user);
    }

    @Override
    public UserDTO updateUserPassword(Long id, UserDTO userDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        user = userRepository.save(user);
        return new UserDTO(user);
    }

    @Override
    public UserDTO updateUserRole(Long id, UserDTO userDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        user.setRole(userDTO.getRole());
        user = userRepository.save(user);
        return new UserDTO(user);
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public UserResponseDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with ID: " + id));
        return new UserResponseDTO(user);
    }
}
