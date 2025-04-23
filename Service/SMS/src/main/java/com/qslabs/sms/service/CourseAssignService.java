package com.qslabs.sms.service;

import com.qslabs.sms.dto.CourseAssignDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service interface for handling course assignments to users (e.g., teachers or students).
 */
public interface CourseAssignService {

    /**
     * Retrieves a paginated list of all course assignments.
     *
     * @param pageable pagination and sorting information
     * @return a page of CourseAssignDTOs
     */
    Page<CourseAssignDTO> getAllCoursesAssignment(Pageable pageable);


    /**
     * Retrieves a specific course assignment by its ID.
     *
     * @param id the ID of the course assignment
     * @return CourseAssignDTO with assignment details
     */
    CourseAssignDTO getCourseAssign(Long id);

    /**
     * Creates a new course assignment.
     *
     * @param courseAssignDTO the assignment data to create
     * @return the created CourseAssignDTO
     */
    CourseAssignDTO createCourseAssign(CourseAssignDTO courseAssignDTO);

    /**
     * Updates an existing course assignment.
     *
     * @param id              ID of the assignment to update
     * @param courseAssignDTO updated assignment data
     * @return the updated CourseAssignDTO
     */
    CourseAssignDTO updateCourseAssign(Long id, CourseAssignDTO courseAssignDTO);

    /**
     * Deletes a course assignment by its ID.
     *
     * @param id ID of the assignment to delete
     */
    void deleteCourseAssign(Long id);

    Long getAssignedCourseCountByUser(Long userId);
}
