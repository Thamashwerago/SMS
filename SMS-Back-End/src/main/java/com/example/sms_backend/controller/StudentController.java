package com.example.sms_backend.controller;

import com.example.sms_backend.dto.StudentDTO;
import com.example.sms_backend.model.Student;
import com.example.sms_backend.service.ExternalDataService;
import com.example.sms_backend.service.StudentService;
import com.example.sms_backend.util.Constants;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * Controller for managing student records.
 * Provides endpoints for retrieving, adding, updating, and deleting student records.
 */
@RestController
@RequestMapping(Constants.REQUEST_MAPPING_STUDENT)
public class StudentController {

    private final StudentService studentService;
    private final ExternalDataService externalDataService;

    /**
     * Constructor to inject dependencies.
     *
     * @param studentService        Service layer for student operations.
     * @param externalDataService   Service layer for fetching external data (attendance, courses).
     */
    public StudentController(StudentService studentService, ExternalDataService externalDataService) {
        this.studentService = studentService;
        this.externalDataService = externalDataService;
    }

    /**
     * Retrieves all students with pagination.
     *
     * @param page The page number (default = 0).
     * @param size The number of records per page (default = 10).
     * @return ResponseEntity containing a paginated list of students.
     */
    @GetMapping
    public ResponseEntity<?> getAllStudents(@RequestParam(defaultValue = Constants.ZERO) int page,
                                            @RequestParam(defaultValue = Constants.TEN) int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<StudentDTO> students = studentService.getAllStudents(pageable);

        Map<String, Object> response = new HashMap<>();
        response.put(Constants.MESSAGE, Constants.STUDENTS_FETCHED);
        response.put(Constants.STUDENTS, students.getContent());
        response.put(Constants.CURRENT_PAGE, students.getNumber());
        response.put(Constants.TOTAL_PAGES, students.getTotalPages());
        response.put(Constants.TOTAL_STUDENTS, students.getTotalElements());

        return ResponseEntity.ok(response);
    }

    /**
     * Retrieves a student by ID.
     *
     * @param id The ID of the student.
     * @return ResponseEntity containing the student details.
     */
    @GetMapping(Constants.GET_MAPPING_STUDENT)
    public ResponseEntity<?> getStudentById(@PathVariable Long id) {
        StudentDTO student = studentService.getStudentById(id);
        Map<String, Object> response = new HashMap<>();

        if (student == null) {
            response.put(Constants.MESSAGE, String.format(Constants.STUDENT_NOT_FOUND, id));
            return ResponseEntity.status(404).body(response);
        }

        response.put(Constants.MESSAGE, String.format(Constants.STUDENT_FOUND, id));
        response.put(Constants.STUDENT, student);
        return ResponseEntity.ok(response);
    }

    /**
     * Adds a new student.
     *
     * @param student The student details to be added.
     * @return ResponseEntity containing the created student record.
     */
    @PostMapping
    public ResponseEntity<?> addStudent(@RequestBody Student student) {
        StudentDTO savedStudent = studentService.addStudent(student);

        Map<String, Object> response = new HashMap<>();
        response.put(Constants.MESSAGE, String.format(Constants.STUDENT_ADDED, savedStudent.getId()));
        response.put(Constants.STUDENT, savedStudent);

        return ResponseEntity.status(201).body(response);
    }

    /**
     * Updates an existing student record.
     *
     * @param id             The ID of the student to update.
     * @param updatedStudent The updated student details.
     * @return ResponseEntity containing the updated student record.
     */
    @PutMapping(Constants.PUT_MAPPING_STUDENT)
    public ResponseEntity<?> updateStudent(@PathVariable Long id, @RequestBody Student updatedStudent) {
        StudentDTO student = studentService.updateStudent(id, updatedStudent);
        Map<String, Object> response = new HashMap<>();

        if (student == null) {
            response.put(Constants.MESSAGE, String.format(Constants.STUDENT_NOT_FOUND, id));
            return ResponseEntity.status(404).body(response);
        }

        response.put(Constants.MESSAGE, String.format(Constants.STUDENT_UPDATED, id));
        response.put(Constants.STUDENT, student);
        return ResponseEntity.ok(response);
    }

    /**
     * Deletes a student record.
     *
     * @param id The ID of the student to delete.
     * @return ResponseEntity with a success or "Not Found" message.
     */
    @DeleteMapping(Constants.DELETE_MAPPING_STUDENT)
    public ResponseEntity<?> deleteStudent(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();

        if (!studentService.deleteStudent(id)) {
            response.put(Constants.MESSAGE, String.format(Constants.STUDENT_NOT_FOUND, id));
            return ResponseEntity.status(404).body(response);
        }

        response.put(Constants.MESSAGE, String.format(Constants.STUDENT_DELETED, id));
        return ResponseEntity.ok(response);
    }

    /**
     * Retrieves a student along with their attendance and enrolled courses.
     *
     * @param id The ID of the student.
     * @return ResponseEntity containing student details, attendance records, and courses.
     */
    @GetMapping(Constants.GET_MAPPING_ATTENDANCE)
    public ResponseEntity<?> getStudentDetails(@PathVariable Long id) {
        StudentDTO student = studentService.getStudentById(id);
        Map<String, Object> response = new HashMap<>();

        if (student == null) {
            response.put(Constants.MESSAGE, String.format(Constants.STUDENT_NOT_FOUND, id));
            return ResponseEntity.status(404).body(response);
        }

        // Fetch attendance and courses (with safe handling)
        Optional<List<Map<String, Object>>> attendanceRecords = externalDataService.getStudentAttendance(id);
        Optional<List<Map<String, Object>>> enrolledCourses = externalDataService.getStudentCourses(id);

        response.put(Constants.MESSAGE, String.format(Constants.STUDENT_DETAILS_FETCHED, id));
        response.put(Constants.STUDENT, student);
        response.put(Constants.ATTENDANCERECORDS, attendanceRecords.orElse(List.of()));
        response.put(Constants.ENROLLEDCOURSES, enrolledCourses.orElse(List.of()));

        return ResponseEntity.ok(response);
    }
}

