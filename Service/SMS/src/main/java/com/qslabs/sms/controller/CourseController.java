package com.qslabs.sms.controller;


import com.qslabs.sms.dto.CourseDTO;
import com.qslabs.sms.service.CourseAssignService;
import com.qslabs.sms.service.CourseService;
import com.qslabs.sms.util.Constants;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

/**
 * Controller for managing course-related operations such as CRUD and pagination.
 */
@RestController
@RequestMapping(Constants.REQUEST_MAPPING_COURSE)
public class CourseController {

    @Autowired
    private CourseService courseService;

    @Autowired
    private CourseAssignService courseAssignService;

    /**
     * Retrieves all courses with pagination and sorting.
     *
     * @param page      Page number (default = 0)
     * @param size      Number of items per page (default = 10)
     * @param sortBy    Field to sort by (default = "id")
     * @param ascending Sort direction (true for ascending, false for descending)
     * @return Paginated list of courses
     */
    @GetMapping
    public ResponseEntity<Page<CourseDTO>> getAllCourses(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size, @RequestParam(defaultValue = "id") String sortBy, @RequestParam(defaultValue = "true") boolean ascending) {
        Sort sort = ascending ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(courseService.getAllCourses(pageable));
    }

    /**
     * Retrieves a course by its ID.
     *
     * @param id ID of the course
     * @return CourseDTO object
     */
    @GetMapping("/{id}")
    public ResponseEntity<CourseDTO> getCourseById(@PathVariable long id) {
        return ResponseEntity.ok(courseService.getCourseById(id));
    }

    /**
     * Creates a new course.
     * Only accessible by users with ROLE_ADMIN.
     *
     * @param courseDTO DTO with course details
     * @return Created CourseDTO
     */
    @Secured("ROLE_ADMIN")
    @PostMapping
    public ResponseEntity<CourseDTO> createCourse(@RequestBody @Valid CourseDTO courseDTO) {
        return ResponseEntity.ok(courseService.createCourse(courseDTO));
    }

    /**
     * Updates an existing course.
     * Only accessible by users with ROLE_ADMIN.
     *
     * @param courseDTO Updated course details
     * @param id        ID of the course to update
     * @return Updated CourseDTO
     */
    @Secured("ROLE_ADMIN")
    @PutMapping("/{id}")
    public ResponseEntity<CourseDTO> updateCourse(@RequestBody @Valid CourseDTO courseDTO, @PathVariable Long id) {
        return ResponseEntity.ok(courseService.updateCourse(id, courseDTO));
    }

    /**
     * Deletes a course by its ID.
     * Only accessible by users with ROLE_ADMIN.
     *
     * @param id ID of the course to delete
     * @return HTTP 204 No Content response
     */
    @Secured("ROLE_ADMIN")
    @DeleteMapping("/{id}")
    public ResponseEntity<CourseDTO> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getCourseCount(@RequestParam(required = false) Long userId) {
        Long count = (userId != null)
                ? courseAssignService.getAssignedCourseCountByUser(userId)
                : courseService.getCourseCount();
        return ResponseEntity.ok(count);
    }
}
