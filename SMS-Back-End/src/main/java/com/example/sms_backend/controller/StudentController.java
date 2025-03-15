package com.example.sms_backend.controller;

import com.example.sms_backend.dto.StudentDTO;
import com.example.sms_backend.model.Student;
import com.example.sms_backend.service.ExternalDataService;
import com.example.sms_backend.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;

    private final ExternalDataService externalDataService;

    public StudentController(StudentService studentService, ExternalDataService externalDataService) {
        this.studentService = studentService;
        this.externalDataService = externalDataService;
    }

    // Fetch all students
    @GetMapping
    public ResponseEntity<List<StudentDTO>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    // Fetch a student by ID
    @GetMapping("/{id}")
    public ResponseEntity<StudentDTO> getStudentById(@PathVariable Long id) {
        StudentDTO student = studentService.getStudentById(id);
        return student != null ? ResponseEntity.ok(student) : ResponseEntity.notFound().build();
    }

    // Add a new student
    @PostMapping
    public ResponseEntity<StudentDTO> addStudent(@RequestBody Student student) {
        return ResponseEntity.ok(studentService.addStudent(student));
    }

    // Update a student
    @PutMapping("/{id}")
    public ResponseEntity<StudentDTO> updateStudent(@PathVariable Long id, @RequestBody Student updatedStudent) {
        StudentDTO student = studentService.updateStudent(id, updatedStudent);
        return student != null ? ResponseEntity.ok(student) : ResponseEntity.notFound().build();
    }

    // Delete a student
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        return studentService.deleteStudent(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    // Fetch a student with attendance and courses
    @GetMapping("/{id}/details")
    public ResponseEntity<Map<String, Object>> getStudentDetails(@PathVariable Long id) {
        StudentDTO student = studentService.getStudentById(id);
        if (student == null) {
            return ResponseEntity.notFound().build();
        }

        // Fetch attendance and courses (with safe handling)
        Optional<List<Map<String, Object>>> attendanceRecords = externalDataService.getStudentAttendance(id);
        Optional<List<Map<String, Object>>> enrolledCourses = externalDataService.getStudentCourses(id);

        // Build response
        Map<String, Object> response = new HashMap<>();
        response.put("student", student);
        response.put("attendanceRecords", attendanceRecords.orElse(List.of())); // Default to empty list if unavailable
        response.put("enrolledCourses", enrolledCourses.orElse(List.of())); // Default to empty list if unavailable

        return ResponseEntity.ok(response);
    }
}
