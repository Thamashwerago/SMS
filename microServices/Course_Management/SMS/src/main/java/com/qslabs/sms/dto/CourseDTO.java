package com.qslabs.sms.dto;

import com.qslabs.sms.model.Course;

/**
 * Data Transfer Object for the Course entity.
 * Used to transfer course-related data between layers in a clean and secure way.
 */
public class CourseDTO {
    private Long id;
    private String code;
    private String name;
    private Integer credits;
    private Integer duration;
    private String description;

    /**
     * Default constructor (required for deserialization).
     */
    public CourseDTO() {}

    /**
     * Parameterized constructor for creating a DTO manually.
     */
    public CourseDTO(String code, String name, Integer credits, Integer duration, String description) {
        this.code = code;
        this.name = name;
        this.credits = credits;
        this.duration = duration;
        this.description = description;
    }

    /**
     * Constructor to convert a Course entity to CourseDTO.
     *
     * @param course Course entity object
     */
    public CourseDTO(Course course) {
        this.id = course.getId();
        this.code = course.getCode();
        this.name = course.getName();
        this.credits = course.getCredits();
        this.duration = course.getDuration();
        this.description = course.getDescription();
    }

    // ------------------- Getters and Setters ------------------- //
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getCredits() {
        return credits;
    }

    public void setCredits(Integer credits) {
        this.credits = credits;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
