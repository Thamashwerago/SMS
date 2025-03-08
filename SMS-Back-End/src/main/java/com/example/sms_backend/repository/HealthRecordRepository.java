package com.example.sms_backend.repository;

import com.example.sms_backend.model.HealthRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HealthRecordRepository extends JpaRepository<HealthRecord, Long> {

    // Find health record by student ID
    HealthRecord findByStudentId(Long studentId);
}
