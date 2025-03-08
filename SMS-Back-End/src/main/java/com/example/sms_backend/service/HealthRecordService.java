package com.example.sms_backend.service;

import com.example.sms_backend.model.HealthRecord;
import com.example.sms_backend.repository.HealthRecordRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class HealthRecordService {

    private final HealthRecordRepository healthRecordRepository;

    public HealthRecordService(HealthRecordRepository healthRecordRepository) {
        this.healthRecordRepository = healthRecordRepository;
    }

    // Get a student's health record by student ID
    public HealthRecord getHealthRecordByStudentId(Long studentId) {
        return healthRecordRepository.findByStudentId(studentId);
    }

    // Add a new health record
    public HealthRecord addHealthRecord(HealthRecord healthRecord) {
        return healthRecordRepository.save(healthRecord);
    }

    // Update an existing health record
    public HealthRecord updateHealthRecord(Long id, HealthRecord updatedRecord) {
        if (healthRecordRepository.existsById(id)) {
            updatedRecord.setId(id);
            return healthRecordRepository.save(updatedRecord);
        }
        return null; // Handle case where health record doesn't exist
    }

    // Delete a health record by ID
    public boolean deleteHealthRecord(Long id) {
        if (healthRecordRepository.existsById(id)) {
            healthRecordRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
