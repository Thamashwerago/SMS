package com.qslabs.sms.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.qslabs.sms.model.Attendance;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.time.LocalDate;


/**
 * Data Transfer Object for Attendance.
 * Carries data between layers and validates input data for attendance records.
 */
public class AttendanceDTO {

    private Long id;

    @NotNull(message = "Student ID cannot be null")
    private Long userId;

    private String role;

    private Long courseId;

    @NotNull(message = "Date cannot be null")
    @JsonFormat(pattern = "yyyy-MM-dd")  // to remember: JSON response should also follow "yyyy-MM-dd"
    private LocalDate date;

    @NotNull(message = "Status cannot be null")
    @Pattern(regexp = "Present|Absent", message = "Status must be either 'Present' or 'Absent'")
    private String status;

    /**
     * Default constructor required for deserialization.
     */
    public AttendanceDTO() {
    }

    /**
     * Constructor for creating DTO from input fields.
     */
    public AttendanceDTO(Long userId,String role, Long courseId, LocalDate date, String status) {
        this.userId = userId;
        this.role = role;
        this.courseId = courseId;
        this.date = date;
        this.status = status;
    }

    /**
     * Constructor to convert Entity to DTO.
     *
     * @param attendance Attendance entity object
     */
    public AttendanceDTO(Attendance attendance) {
        this.id = attendance.getId();
        this.userId = attendance.getUserId();
        this.role = attendance.getRole();
        this.courseId = attendance.getCourseId();
        this.date = attendance.getDate();
        this.status = attendance.getStatus();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }

    public LocalDate getDate() {
        return date;
    }
    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }

    public String getRole() {
        return role;
    }
    public void setRole(String role) {
        this.role = role;
    }
}
