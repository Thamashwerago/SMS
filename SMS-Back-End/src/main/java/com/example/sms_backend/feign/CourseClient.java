package com.example.sms_backend.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import java.util.List;
import java.util.Map;

@FeignClient(name = "course-service", url = "${course.service.url}")
public interface CourseClient {

    // Fetch enrolled courses for a student
    @GetMapping("/student/{studentId}")
    List<Map<String, Object>> getCoursesByStudentId(@PathVariable("studentId") Long studentId);
}
