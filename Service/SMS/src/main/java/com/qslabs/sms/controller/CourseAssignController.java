package com.qslabs.sms.controller;

import com.qslabs.sms.dto.CourseAssignDTO;
import com.qslabs.sms.service.CourseAssignService;
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
 * Controller to manage Course Assignments between teachers and courses.
 */
@RestController
@RequestMapping(Constants.REQUEST_MAPPING_COURSEASSIGN) // Base URL for all course assignment operations
public class CourseAssignController {

    @Autowired
    private CourseAssignService courseAssignService;

    /**
     * Retrieves all course assignments with pagination and sorting.
     *
     * @param page      page number (default is 0)
     * @param size      number of records per page (default is 10)
     * @param sortBy    field to sort by (default is "id")
     * @param ascending sort order (true for ascending, false for descending)
     * @return paginated list of CourseAssignDTO
     */
    @GetMapping
    public ResponseEntity<Page<CourseAssignDTO>> getAllCoursesAssign(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size, @RequestParam(defaultValue = "id") String sortBy, @RequestParam(defaultValue = "true") boolean ascending) {
        Sort sort = ascending ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(courseAssignService.getAllCoursesAssignment(pageable));
    }

    /**
     * Retrieves a course assignment by its ID.
     *
     * @param id ID of the course assignment
     * @return CourseAssignDTO with the given ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<CourseAssignDTO> getCourseAssignById(@PathVariable long id) {
        return ResponseEntity.ok(courseAssignService.getCourseAssign(id));
    }

    /**
     * Creates a new course assignment.
     * Only accessible by users with ROLE_ADMIN.
     *
     * @param courseAssignDTO DTO containing course assignment details
     * @return created CourseAssignDTO
     */
    @Secured("ROLE_ADMIN")
    @PostMapping
    public ResponseEntity<CourseAssignDTO> createCourseAssign(@RequestBody @Valid CourseAssignDTO courseAssignDTO) {
        return ResponseEntity.ok(courseAssignService.createCourseAssign(courseAssignDTO));
    }

    /**
     * Updates an existing course assignment.
     * Only accessible by users with ROLE_ADMIN.
     *
     * @param courseAssignDTO updated course assignment details
     * @param id              ID of the assignment to update
     * @return updated CourseAssignDTO
     */
    @Secured("ROLE_ADMIN")
    @PutMapping("/{id}")
    public ResponseEntity<CourseAssignDTO> updateCourseAssign(@RequestBody @Valid CourseAssignDTO courseAssignDTO, @PathVariable Long id) {
        return ResponseEntity.ok(courseAssignService.updateCourseAssign(id, courseAssignDTO));
    }

    /**
     * Deletes a course assignment by its ID.
     * Only accessible by users with ROLE_ADMIN.
     *
     * @param id ID of the assignment to delete
     * @return HTTP 204 No Content
     */
    @Secured("ROLE_ADMIN")
    @DeleteMapping("/{id}")
    public ResponseEntity<CourseAssignDTO> deleteCourseAssign(@PathVariable Long id) {
        courseAssignService.deleteCourseAssign(id);
        return ResponseEntity.noContent().build();
    }

}
