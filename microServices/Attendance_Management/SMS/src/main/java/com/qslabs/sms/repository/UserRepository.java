package com.qslabs.sms.repository;

import com.qslabs.sms.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for the User entity.
 * Provides standard CRUD operations and user-specific query methods.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Find a user by username.
     *
     * @param username the username to search
     * @return Optional containing the User if found
     */
    Optional<User> findByUsername(String username);

    /**
     * Find a user by both username and password.
     *
     * @param username the username
     * @param password the plain-text password
     * @return Optional containing the User if credentials match
     */
    Optional<User> findByUsernameAndPassword(String username, String password);
}
