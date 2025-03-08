package com.example.sms_backend.repository;

import com.example.sms_backend.model.ParentGuardian;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParentGuardianRepository extends JpaRepository<ParentGuardian, Long> {

    // Fetch all parents/guardians by student ID
    List<ParentGuardian> findByStudentId(Long studentId);
}
