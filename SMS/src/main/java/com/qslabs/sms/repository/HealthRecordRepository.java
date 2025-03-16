package com.qslabs.sms.repository;

import com.qslabs.sms.model.HealthRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for HealthRecord entities.
 * Provides standard CRUD operations and custom queries for HealthRecord.
 */
@Repository
public interface HealthRecordRepository extends JpaRepository<HealthRecord, Long> {

    /**
     * Find a HealthRecord based on the associated Student's studentId.
     *
     * @param studentId the unique identifier of the Student.
     * @return the HealthRecord associated with the given Student ID, or null if not found.
     */
    HealthRecord findByStudentId(Long studentId);
}
