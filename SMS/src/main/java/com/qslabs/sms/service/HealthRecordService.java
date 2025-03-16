package com.qslabs.sms.service;

import com.qslabs.sms.model.HealthRecord;
import com.qslabs.sms.repository.HealthRecordRepository;
import org.springframework.stereotype.Service;

/**
 * Service class for handling operations related to HealthRecord.
 * Provides methods to retrieve, add, update, and delete health records.
 */
@Service
public class HealthRecordService {

    private final HealthRecordRepository healthRecordRepository;

    /**
     * Constructor for HealthRecordService.
     * Uses constructor-based dependency injection to initialize the HealthRecordRepository.
     *
     * @param healthRecordRepository the repository for health record operations.
     */
    public HealthRecordService(HealthRecordRepository healthRecordRepository) {
        this.healthRecordRepository = healthRecordRepository;
    }

    /**
     * Retrieve a student's health record by their student ID.
     *
     * @param studentId the unique identifier of the student.
     * @return the HealthRecord associated with the given student ID, or null if not found.
     */
    public HealthRecord getHealthRecordByStudentId(Long studentId) {
        return healthRecordRepository.findByStudentId(studentId);
    }

    /**
     * Add a new health record.
     *
     * @param healthRecord the HealthRecord object to be added.
     * @return the saved HealthRecord instance.
     */
    public HealthRecord addHealthRecord(HealthRecord healthRecord) {
        return healthRecordRepository.save(healthRecord);
    }

    /**
     * Update an existing health record.
     *
     * If the health record exists, the updated record's ID is set to the provided ID and saved.
     * Otherwise, the method returns null.
     *
     * @param id the unique identifier of the health record to update.
     * @param updatedRecord the HealthRecord object containing updated information.
     * @return the updated HealthRecord if found and updated; otherwise, null.
     */
    public HealthRecord updateHealthRecord(Long id, HealthRecord updatedRecord) {
        if (healthRecordRepository.existsById(id)) {
            // Set the ID of the updated record to ensure the correct entity is updated.
            updatedRecord.setId(id);
            return healthRecordRepository.save(updatedRecord);
        }
        // Return null if the health record doesn't exist.
        return null;
    }

    /**
     * Delete a health record by its ID.
     *
     * Checks if the record exists before attempting deletion.
     *
     * @param id the unique identifier of the health record to delete.
     * @return true if deletion was successful, false otherwise.
     */
    public boolean deleteHealthRecord(Long id) {
        if (healthRecordRepository.existsById(id)) {
            healthRecordRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
