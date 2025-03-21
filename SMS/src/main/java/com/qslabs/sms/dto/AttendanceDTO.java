package com.qslabs.sms.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.qslabs.sms.model.Attendance;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.time.LocalDate;

public class AttendanceDTO {

    @NotNull(message = "Student ID cannot be null")
    private Long studentId;

    @NotNull(message = "Date cannot be null")
    @JsonFormat(pattern = "yyyy-MM-dd")  // to remember: JSON response should also follow "yyyy-MM-dd"
    private LocalDate date;

    @NotNull(message = "Status cannot be null")
    @Pattern(regexp = "Present|Absent", message = "Status must be either 'Present' or 'Absent'")
    private String status;

    public AttendanceDTO() {
    }

    public AttendanceDTO(Attendance attendance) {
        this.studentId = attendance.getStudentId();
        this.date = attendance.getDate();
        this.status = attendance.getStatus();
    }

    // Getters and Setters
    public Long getStudentId() {
        return studentId;
    }
    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

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
