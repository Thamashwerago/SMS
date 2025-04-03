package com.qslabs.sms.controller;

import com.qslabs.sms.dto.TeacherDTO;
import com.qslabs.sms.service.TeacherService;
import com.qslabs.sms.util.Constants;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;
// Todo
// Crreate utip package and create Constant class and add hard code value ex: URL
// Get all student add pagination(limit, range) method


/**
 * Controller to manage teacher-related operations like create, read, update, delete (CRUD).
 */
@RestController
@RequestMapping(Constants.REQUEST_MAPPING_TEACHER)
public class TeacherController {

        @Autowired
        private TeacherService teacherService;

    /**
     * Retrieves all teachers with pagination and sorting.
     *
     * @param page      Page number (default = 0)
     * @param size      Number of records per page (default = 10)
     * @param sortBy    Field name to sort by (default = "id")
     * @param ascending Sort order (true = ASC, false = DESC)
     * @return Paginated list of teachers
     */
        @GetMapping
        public ResponseEntity<Page<TeacherDTO>> getAllStudents(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size, @RequestParam(defaultValue = "id") String sortBy, @RequestParam(defaultValue = "true") boolean ascending) {
            Sort sort = ascending ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
            Pageable pageable = PageRequest.of(page, size, sort);
            return ResponseEntity.ok(teacherService.getAllTeachers(pageable));
        }

    /**
     * Retrieves a specific teacher by ID.
     *
     * @param id Teacher ID
     * @return TeacherDTO object
     */
        @GetMapping("/{id}")
        public ResponseEntity<TeacherDTO> getTeacherById(@PathVariable Long id) {
            return ResponseEntity.ok(teacherService.getTeacherById(id));
        }

    /**
     * Retrieves a specific teacher by user ID.
     *
     * @param id Teacher user ID
     * @return TeacherDTO object
     */
    @GetMapping("/user/{id}")
    public ResponseEntity<TeacherDTO> getTeacherByUserId(@PathVariable Long id) {
        return ResponseEntity.ok(teacherService.getTeacherByUserId(id));
    }

    /**
     * Creates a new teacher record.
     * Only accessible by users with ROLE_ADMIN.
     *
     * @param teacherDTO DTO object with teacher data
     * @return Created teacher object with status 201
     */
        @Secured("ROLE_ADMIN")
        @PostMapping
        public ResponseEntity<TeacherDTO> createTeacher(@RequestBody @Valid TeacherDTO teacherDTO) {
            return new ResponseEntity<>(teacherService.createTeacher(teacherDTO), HttpStatus.CREATED);
        }

    /**
     * Updates an existing teacher.
     * Accessible by ROLE_ADMIN and ROLE_TEACHER.
     *
     * @param id         Teacher ID to update
     * @param teacherDTO Updated data
     * @return Updated TeacherDTO
     */
        @Secured({"ROLE_ADMIN","ROLE_TEACHER"})
        @PutMapping("/{id}")
        public ResponseEntity<TeacherDTO> updateTeacher(@PathVariable Long id, @RequestBody @Valid TeacherDTO teacherDTO) {
            return ResponseEntity.ok(teacherService.updateTeacher(id, teacherDTO));
        }

    /**
     * Deletes a teacher record by ID.
     * Only accessible by users with ROLE_ADMIN.
     *
     * @param id ID of the teacher to delete
     * @return 204 No Content on successful deletion
     */
        @Secured("ROLE_ADMIN")
        @DeleteMapping("/{id}")
        public ResponseEntity<Void> deleteTeacher(@PathVariable Long id) {
            teacherService.deleteTeacher(id);
            return ResponseEntity.noContent().build();
        }
}

