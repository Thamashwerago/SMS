package com.qslabs.sms.repository;

import com.qslabs.sms.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for the Course entity.
 * Provides CRUD operations and supports custom queries if needed.
 */
@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
}

