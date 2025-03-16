package com.qslabs.sms.repository;

import com.qslabs.sms.model.ParentGuardian;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for ParentGuardian entities.
 * Extends JpaRepository to provide standard CRUD operations and custom query methods.
 */
@Repository
public interface ParentGuardianRepository extends JpaRepository<ParentGuardian, Long> {

    /**
     * Fetch all ParentGuardian entities associated with a specific student ID.
     *
     * @param studentId the unique identifier of the student.
     * @return a list of ParentGuardian entities linked to the given student ID.
     */
    List<ParentGuardian> findByStudentId(Long studentId);
}
