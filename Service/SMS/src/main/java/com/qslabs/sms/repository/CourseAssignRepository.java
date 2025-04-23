package com.qslabs.sms.repository;

import com.qslabs.sms.model.CourseAssign;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for the CourseAssign entity.
 * Extends JpaRepository to provide basic CRUD operations.
 */
@Repository
public interface CourseAssignRepository extends JpaRepository<CourseAssign, Long> {

    @Query("SELECT COUNT(DISTINCT ca.courseId) FROM CourseAssign ca WHERE ca.userId = :userId")
    Long getAssignedCourseCountByUserId(@Param("userId") Long userId);
}
