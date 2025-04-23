package com.qslabs.sms.controller;

import com.qslabs.sms.dto.StudentDTO;
import com.qslabs.sms.model.Student;
import com.qslabs.sms.service.StudentService;
import com.qslabs.sms.util.Constants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for managing student records.
 * Provides endpoints to retrieve, add, update, and delete students,
 * along with fetching additional details such as attendance and enrolled courses.
 */
@RestController
@RequestMapping(Constants.REQUEST_MAPPING_STUDENT)
public class StudentController {

    @Autowired
    private StudentService studentService;

    /**
     * Retrieves all students with pagination.
     *
     * @param limit Number of students per page
     * @param offset Starting point for fetching students
     * @return ResponseEntity containing a paginated list of students
     */
    @GetMapping
    public ResponseEntity<List<StudentDTO>> getAllStudents(@RequestParam(defaultValue = "10") int limit, @RequestParam(defaultValue = "0") int offset) {
        return ResponseEntity.ok(studentService.getAllStudents(limit, offset));
    }

    /**
     * Retrieves a student by ID.
     *
     * @param id ID of the student
     * @return ResponseEntity containing the student details if found, otherwise a 404 response
     */
    @GetMapping("/{id}")
    public ResponseEntity<StudentDTO> getStudentById(@PathVariable Long id) {
        StudentDTO student = studentService.getStudentById(id);
        return student != null ? ResponseEntity.ok(student) : ResponseEntity.notFound().build();
    }

    /**
     * Adds a new student record.
     *
     * @param student The student details to be added
     * @return ResponseEntity containing the added student record
     */
    @Secured("ROLE_ADMIN")
    @PostMapping
    public ResponseEntity<StudentDTO> addStudent(@RequestBody Student student) {
        return ResponseEntity.ok(studentService.addStudent(student));
    }

    /**
     * Updates an existing student record.
     *
     * @param id ID of the student to be updated
     * @param updatedStudent The updated student details
     * @return ResponseEntity containing the updated record if successful, otherwise a 404 response
     */
    @Secured({"ROLE_ADMIN","ROLE_STUDENT"})
    @PutMapping("/{id}")
    public ResponseEntity<StudentDTO> updateStudent(@PathVariable Long id, @RequestBody Student updatedStudent) {
        StudentDTO student = studentService.updateStudent(id, updatedStudent);
        return student != null ? ResponseEntity.ok(student) : ResponseEntity.notFound().build();
    }

    /**
     * Deletes a student record by ID.
     *
     * @param id ID of the student to be deleted
     * @return ResponseEntity with no content if successful, otherwise a 404 response
     */
    @Secured("ROLE_ADMIN")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        return studentService.deleteStudent(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getStudentCount() {
        Long count = studentService.getStudentCount();
        return ResponseEntity.ok(count);
    }
}
