package com.qslabs.sms.service.impl;

import com.qslabs.sms.dto.CourseDTO;
import com.qslabs.sms.exception.CourseAssignException;
import com.qslabs.sms.model.Course;
import com.qslabs.sms.repository.CourseRepository;
import com.qslabs.sms.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

/**
 * Implementation of the CourseService interface.
 * Contains business logic for managing course data.
 */
@Service
public class CourseServiceImpl implements CourseService {

    @Autowired
    private CourseRepository courseRepository;


    /**
     * Retrieves all courses with pagination support.
     *
     * @param pageable pagination configuration (page number, size, sort)
     * @return paginated list of CourseDTOs
     */
    @Override
    public Page<CourseDTO> getAllCourses(Pageable pageable) {
        return courseRepository.findAll(pageable).map(CourseDTO::new);
    }

    /**
     * Retrieves a course by its unique ID.
     *
     * @param id course ID
     * @return CourseDTO of the found course
     * @throws CourseAssignException if course is not found
     */
    @Override
    @Cacheable(value = "course", key = "#id")
    public CourseDTO getCourseById(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new CourseAssignException(" with id " + id));
        return new CourseDTO(course);
    }

    /**
     * Creates a new course entry in the database.
     *
     * @param courseDTO data to create the course
     * @return created CourseDTO
     */
    @Override
    @CachePut(value = "course", key = "#result.id")
    public CourseDTO createCourse(CourseDTO courseDTO) {
        Course course = new Course(courseDTO);
        course = courseRepository.save(course);
        return new CourseDTO(course);
    }

    /**
     * Updates an existing course.
     *
     * @param id        ID of the course to update
     * @param courseDTO updated data for the course
     * @return updated CourseDTO
     * @throws CourseAssignException if course is not found
     */
    @Override
    @CachePut(value = "course", key = "#id")
    public CourseDTO updateCourse(Long id, CourseDTO courseDTO) {
        Course course = courseRepository.findById(id).orElseThrow(() -> new CourseAssignException(" with id " + id));

        course.setName(courseDTO.getName());
        course.setCredits(courseDTO.getCredits());
        course.setDuration(courseDTO.getDuration());
        course.setCode(courseDTO.getCode());
        course.setDescription(courseDTO.getDescription());

        course = courseRepository.save(course);
        return new CourseDTO(course);
    }

    /**
     * Deletes a course from the database by its ID.
     *
     * @param id ID of the course to delete
     * @throws CourseAssignException if course does not exist
     */
    @Override
    @CacheEvict(value = "course", key = "#id")
    public void deleteCourse(Long id) {
        if (!courseRepository.existsById(id)) {
            throw new CourseAssignException(" with id " + id);
        }
        courseRepository.deleteById(id);
    }
}
