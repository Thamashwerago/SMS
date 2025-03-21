package com.qslabs.sms.service;

import com.qslabs.sms.dto.UserDTO;
import com.qslabs.sms.model.User;
import com.qslabs.sms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserDTO createUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);
        return new UserDTO(savedUser.getUsername(), savedUser.getRole());
    }

    public Optional<UserDTO> getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .map(user -> new UserDTO(user.getUsername(), user.getRole()));
    }
}
