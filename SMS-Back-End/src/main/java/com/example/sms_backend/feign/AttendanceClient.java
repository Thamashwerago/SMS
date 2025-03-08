package com.example.sms_backend.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import java.util.List;
import java.util.Map;

@FeignClient(name = "attendance-service", url = "${attendance.service.url}")
public interface AttendanceClient {

    // Fetch attendance records for a student
    @GetMapping("/student/{studentId}")
    List<Map<String, Object>> getAttendanceByStudentId(@PathVariable("studentId") Long studentId);
}
