package com.example.sms_backend.repository;

import com.example.sms_backend.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    // Custom query to find a student by contact number
    Optional<Student> findByContactNumber(String contactNumber);
}
