package com.qslabs.sms.service.impl;

import com.qslabs.sms.dto.UserDTO;
import com.qslabs.sms.model.User;
import com.qslabs.sms.repository.UserRepository;
import com.qslabs.sms.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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

    /**
     * Validates user login credentials.
     *
     * @param username the user's username
     * @param password the user's raw password
     * @return user's role if valid; "null" (as string) if invalid
     */
    @Override
    public String isUser(String username, String password) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException(username));
        if(passwordEncoder.matches(password, user.getPassword())){
            return String.valueOf(user.getRole());
        }else {
            return String.valueOf("null");
        }
    }

    /**
     * Updates the username of a user by their ID.
     *
     * @param id      the user ID
     * @param userDTO DTO containing the new username
     * @return updated UserDTO
     */
    @Override
    public UserDTO updateUserName(Long id, UserDTO userDTO){
        User user = userRepository.findById(id).orElseThrow(()->new UsernameNotFoundException("User not found"));
        user.setUsername(userDTO.getUsername());
        user = userRepository.save(user);
        return new UserDTO(user);
    }

    /**
     * Updates the email of a user.
     *
     * @param id      the user ID
     * @param userDTO DTO containing the new email
     * @return updated UserDTO
     */
    @Override
    public UserDTO updateEmail(Long id, UserDTO userDTO){
        User user = userRepository.findById(id).orElseThrow(()->new UsernameNotFoundException("User not found"));
        user.setEmail(userDTO.getEmail());
        user = userRepository.save(user);
        return new UserDTO(user);
    }

    /**
     * Updates the password for a user, with encoding.
     *
     * @param id      the user ID
     * @param userDTO DTO containing the new (raw) password
     * @return updated UserDTO
     */
    @Override
    public UserDTO updateUserPassword(Long id, UserDTO userDTO){
        User user = userRepository.findById(id).orElseThrow(()->new UsernameNotFoundException("User not found"));
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        user = userRepository.save(user);
        return new UserDTO(user);
    }

    /**
     * Updates the role assigned to a user.
     *
     * @param id      the user ID
     * @param userDTO DTO containing the new role
     * @return updated UserDTO
     */
    @Override
    public UserDTO updateUserRole(Long id, UserDTO userDTO){
        User user = userRepository.findById(id).orElseThrow(()->new UsernameNotFoundException("User not found"));
        user.setRole(userDTO.getRole());
        user = userRepository.save(user);
        return new UserDTO(user);
    }

    /**
     * Deletes a user from the database.
     *
     * @param id the user ID to delete
     */
    @Override
    public void deleteUser(Long id){
        userRepository.deleteById(id);
    }

}
