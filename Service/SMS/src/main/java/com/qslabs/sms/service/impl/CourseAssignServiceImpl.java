package com.qslabs.sms.service.impl;

import com.qslabs.sms.dto.CourseAssignDTO;
import com.qslabs.sms.exception.CourseAssignException;
import com.qslabs.sms.model.CourseAssign;
import com.qslabs.sms.repository.CourseAssignRepository;
import com.qslabs.sms.service.CourseAssignService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

/**
 * Service implementation for managing course assignments.
 * Handles business logic for assigning users (e.g., teachers) to courses.
 */
@Service
public class CourseAssignServiceImpl implements CourseAssignService {

    @Autowired
    private CourseAssignRepository courseAssignRepository;

    /**
     * Retrieves all course assignments with pagination.
     *
     * @param pageable pagination and sorting configuration
     * @return a paginated list of CourseAssignDTOs
     */
    @Override
    public Page<CourseAssignDTO> getAllCoursesAssignment(Pageable pageable){
        return courseAssignRepository.findAll(pageable).map(CourseAssignDTO::new);
    }

    /**
     * Retrieves a course assignment by its ID.
     *
     * @param id the ID of the course assignment
     * @return CourseAssignDTO containing assignment details
     * @throws CourseAssignException if assignment not found
     */
    @Override
    //@Cacheable(value = "courseAssign", key = "#id")
    public CourseAssignDTO getCourseAssign(Long id){
        CourseAssign courseAssign = courseAssignRepository.findById(id)
                .orElseThrow(() -> new CourseAssignException(" with id " + id));
        return new CourseAssignDTO(courseAssign);
    }

    /**
     * Creates a new course assignment.
     *
     * @param courseAssignDTO DTO containing assignment details
     * @return the newly created CourseAssignDTO
     */
    @Override
    //@CachePut(value = "courseAssign", key = "#result.id")
    public CourseAssignDTO createCourseAssign(CourseAssignDTO courseAssignDTO){
        CourseAssign courseAssign = new CourseAssign(courseAssignDTO);
        courseAssign = courseAssignRepository.save(courseAssign);
        return new CourseAssignDTO(courseAssign);
    }

    /**
     * Updates an existing course assignment.
     *
     * @param id              ID of the assignment to update
     * @param courseAssignDTO DTO with updated values
     * @return updated CourseAssignDTO
     * @throws CourseAssignException if assignment not found
     */
    @Override
    //@CachePut(value = "courseAssign", key = "#id")
    public CourseAssignDTO updateCourseAssign(Long id, CourseAssignDTO courseAssignDTO){
        CourseAssign courseAssign = courseAssignRepository.findById(id).orElseThrow(() -> new CourseAssignException(" with id " + id));

        courseAssign.setCourseId(courseAssignDTO.getCourseId());
        courseAssign.setUserId(courseAssignDTO.getUserId());
        courseAssign.setRole(courseAssignDTO.getRole());

        courseAssign = courseAssignRepository.save(courseAssign);
        return new CourseAssignDTO(courseAssign);
    }

    /**
     * Deletes a course assignment by ID.
     *
     * @param id the ID of the assignment to delete
     * @throws CourseAssignException if assignment does not exist
     */
    @Override
    //@CacheEvict(value = "courseAssign", key = "#id")
    public void deleteCourseAssign(Long id){
        if (!courseAssignRepository.existsById(id)) {
            throw new CourseAssignException(" with id " + id);
        }
        courseAssignRepository.deleteById(id);
    }
}
