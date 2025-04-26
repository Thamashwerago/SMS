package com.qslab.sms.controller;


import com.qslab.sms.dto.CourseDTO;
import com.qslab.sms.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

        import java.util.List;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @GetMapping
    public ResponseEntity<List<CourseDTO>> getAllCourses() {
        return ResponseEntity.ok(courseService.getAllCourses());
    }

    @PostMapping
    public ResponseEntity<CourseDTO> createCourse(@RequestBody CourseDTO dto) {
        return ResponseEntity.ok(courseService.createCourse(dto));
    }

    @PostMapping("/{courseId}/enroll/{studentId}")
    public ResponseEntity<CourseDTO> enrollStudent(@PathVariable Long courseId, @PathVariable Long studentId) {
        return ResponseEntity.ok(courseService.enrollStudent(courseId, studentId));
    }
}
