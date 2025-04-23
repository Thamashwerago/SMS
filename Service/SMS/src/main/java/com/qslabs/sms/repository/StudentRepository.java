package com.qslabs.sms.repository;

import com.qslabs.sms.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for the Student entity.
 * Extends JpaRepository to provide CRUD operations and custom queries.
 */
@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    // Custom query to find a student by contact number
    /**
     * Custom query to find a student by their contact number.
     *
     * @param contactNumber the student's phone number
     * @return Optional containing Student if found
     */
    Optional<Student> findByContactNumber(String contactNumber);

    @Query("SELECT COUNT(s) FROM Student s")
    Long getStudentCount();
}
