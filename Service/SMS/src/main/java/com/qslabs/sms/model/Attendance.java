package com.qslabs.sms.model;

import com.qslabs.sms.dto.AttendanceDTO;
import com.qslabs.sms.util.Constants;
import jakarta.persistence.*;

import java.time.LocalDate;

/**
 * Entity class representing the Attendance table in the database.
 * Stores attendance records for students and teachers against specific courses.
 */
@Entity
@Table(name = Constants.ATTENDANCE_TABLE) // Table name defined in a centralized Constants class
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-incremented primary key
    private Long id;
    private Long userId;
    private String role;
    private Long courseId;
    private LocalDate date;
    private String status;

    /**
     * Default constructor for JPA.
     */
    public Attendance() {
    }

    /**
     * Constructor to populate entity from AttendanceDTO.
     *
     * @param attendanceDTO DTO carrying attendance data
     */
    public Attendance(AttendanceDTO attendanceDTO) {
        this.userId = attendanceDTO.getUserId();
        this.role = attendanceDTO.getRole();
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
