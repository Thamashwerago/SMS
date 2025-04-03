package com.qslabs.sms.dto;

import com.qslabs.sms.model.CourseAssign;

/**
 * Data Transfer Object for course assignments.
 * Used to pass data between client, controller, and service layers without exposing the entity.
 */
public class CourseAssignDTO {

    private Long id;
    private Long courseId;
    private Long userId;
    private String role;

    /**
     * Default constructor (required for deserialization).
     */
    public CourseAssignDTO() {}

    /**
     * Parameterized constructor for manually creating a DTO.
     */
    public CourseAssignDTO(Long courseId, Long userId, String role) {
        this.courseId = courseId;
        this.userId = userId;
        this.role = role;
    }

    /**
     * Converts a CourseAssign entity into a CourseAssignDTO.
     *
     * @param courseAssign the entity to convert
     */
    public CourseAssignDTO(CourseAssign courseAssign) {
        this.id = courseAssign.getId();
        this.courseId = courseAssign.getCourseId();
        this.userId = courseAssign.getUserId();
        this.role = courseAssign.getRole();
    }

    // ------------------- Getters and Setters ------------------- //
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
