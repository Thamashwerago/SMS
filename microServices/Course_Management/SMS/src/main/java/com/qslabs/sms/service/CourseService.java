package com.qslabs.sms.service;

import com.qslabs.sms.dto.CourseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service interface for managing Course entities.
 * Provides operations to create, retrieve, update, and delete courses.
 */
public interface CourseService {

    /**
     * Retrieves all courses with pagination support.
     *
     * @param pageable contains page number, size, and sorting information
     * @return a paginated list of CourseDTOs
     */
    Page<CourseDTO> getAllCourses(Pageable pageable);

    /**
     * Retrieves a specific course by its ID.
     *
     * @param id the ID of the course
     * @return CourseDTO with course details
     */
    CourseDTO getCourseById(Long id);

    /**
     * Creates a new course.
     *
     * @param courseDTO the data for the course to be created
     * @return the newly created CourseDTO
     */
    CourseDTO createCourse(CourseDTO courseDTO);

    /**
     * Updates an existing course.
     *
     * @param id        the ID of the course to update
     * @param courseDTO the updated course data
     * @return the updated CourseDTO
     */
    CourseDTO updateCourse(Long id, CourseDTO courseDTO);

    /**
     * Deletes a course by its ID.
     *
     * @param id the ID of the course to delete
     */
    void deleteCourse(Long id);
}
