package com.qslabs.sms.model;

import com.qslabs.sms.dto.AttendanceDTO;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "attendance")
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long studentId;
    private Long courseId;
    private LocalDate date;
    private String status;

    public Attendance() {
    }

    public Attendance(AttendanceDTO attendanceDTO) {
        this.studentId = attendanceDTO.getStudentId();
        this.courseId = attendanceDTO.getCourseId();
        this.date = attendanceDTO.getDate();
        this.status = attendanceDTO.getStatus();
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
