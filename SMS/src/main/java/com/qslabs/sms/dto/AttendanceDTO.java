package com.qslabs.sms.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.qslabs.sms.model.Attendance;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.time.LocalDate;

public class AttendanceDTO {

    private Long id;

    @NotNull(message = "Student ID cannot be null")
    private Long studentId;

    private Long courseId;

    @NotNull(message = "Date cannot be null")
    @JsonFormat(pattern = "yyyy-MM-dd")  // to remember: JSON response should also follow "yyyy-MM-dd"
    private LocalDate date;

    @NotNull(message = "Status cannot be null")
    @Pattern(regexp = "Present|Absent", message = "Status must be either 'Present' or 'Absent'")
    private String status;

    public AttendanceDTO() {
    }

    public AttendanceDTO(Long studentId,Long courseId, LocalDate date, String status) {
        this.studentId = studentId;
        this.courseId = courseId;
        this.date = date;
        this.status = status;
    }

    public AttendanceDTO(Attendance attendance) {
        this.id = attendance.getId();
        this.studentId = attendance.getStudentId();
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

    public Long getStudentId() {
        return studentId;
    }
    public void setStudentId(Long studentId) {
        this.studentId = studentId;
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
}
