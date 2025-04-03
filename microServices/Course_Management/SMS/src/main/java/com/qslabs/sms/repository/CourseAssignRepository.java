package com.qslabs.sms.repository;

import com.qslabs.sms.model.CourseAssign;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for the CourseAssign entity.
 * Extends JpaRepository to provide basic CRUD operations.
 */
@Repository
public interface CourseAssignRepository extends JpaRepository<CourseAssign, Long> {
}
