package com.qslabs.sms.controller;

import com.qslabs.sms.dto.UserDTO;
import com.qslabs.sms.model.User;
import com.qslabs.sms.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public UserDTO registerUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    @GetMapping("/{username}")
    public Optional<UserDTO> getUser(@PathVariable String username) {
        return userService.getUserByUsername(username);
    }
}
