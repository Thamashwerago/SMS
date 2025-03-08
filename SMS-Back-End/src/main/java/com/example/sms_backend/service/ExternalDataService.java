package com.example.sms_backend.service;

import com.example.sms_backend.feign.AttendanceClient;
import com.example.sms_backend.feign.CourseClient;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ExternalDataService {

    private final AttendanceClient attendanceClient;
    private final CourseClient courseClient;

    public ExternalDataService(AttendanceClient attendanceClient, CourseClient courseClient) {
        this.attendanceClient = attendanceClient;
        this.courseClient = courseClient;
    }

    // Fetch student attendance from Attendance Microservice
    public Optional<List<Map<String, Object>>> getStudentAttendance(Long studentId) {
        try {
            return Optional.of(attendanceClient.getAttendanceByStudentId(studentId));
        } catch (Exception e) {
            // Log and return empty Optional to prevent failures
            System.err.println("Error fetching attendance data: " + e.getMessage());
            return Optional.empty();
        }
    }

    // Fetch student enrolled courses from Course Microservice
    public Optional<List<Map<String, Object>>> getStudentCourses(Long studentId) {
        try {
            return Optional.of(courseClient.getCoursesByStudentId(studentId));
        } catch (Exception e) {
            // Log and return empty Optional to prevent failures
            System.err.println("Error fetching course data: " + e.getMessage());
            return Optional.empty();
        }
    }
}
