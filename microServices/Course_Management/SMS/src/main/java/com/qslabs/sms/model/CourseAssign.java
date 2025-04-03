package com.qslabs.sms.model;

import com.qslabs.sms.dto.CourseAssignDTO;
import com.qslabs.sms.util.Constants;
import jakarta.persistence.*;

/**
 * Entity representing the assignment of a course to a user (e.g., teacher or student).
 * Mapped to the COURSEASSIGN_TABLE in the database.
 */
@Entity
@Table(name = Constants.COURSEASSIGN_TABLE)
public class CourseAssign {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long courseId;
    private Long userId;
    private String role;

    /**
     * Default constructor required by JPA.
     */
    public CourseAssign() {}

    /**
     * Constructor to populate entity from CourseAssignDTO.
     *
     * @param courseAssignDTO DTO carrying assignment data
     */
    public CourseAssign(CourseAssignDTO courseAssignDTO) {
        this.courseId = courseAssignDTO.getCourseId();
        this.userId = courseAssignDTO.getUserId();
        this.role = courseAssignDTO.getRole();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
