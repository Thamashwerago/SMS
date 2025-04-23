package com.qslabs.sms.repository;

import com.qslabs.sms.model.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

// Todo
// Add custom method with custom query
/**
 * Repository interface for the Teacher entity.
 * Extends JpaRepository to provide CRUD and custom data access methods.
 */
@Repository
public interface TeacherRepository extends JpaRepository<Teacher, Long> {
    /**
     * Find a teacher by their associated user ID.
     *
     * @param userId the ID from the User table
     * @return Optional containing Teacher if found
     */
    Optional<Teacher> findByUserId(Long userId);

    @Query("SELECT COUNT(t) FROM Teacher t")
    Long getTeacherCount();
}
