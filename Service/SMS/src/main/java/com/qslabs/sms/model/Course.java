package com.qslabs.sms.model;

import com.qslabs.sms.dto.CourseDTO;
import com.qslabs.sms.util.Constants;
import jakarta.persistence.*;

/**
 * Entity class representing a Course in the system.
 * Mapped to the database table defined by {@link Constants#COURSE_TABLE}.
 */
@Entity
@Table(name = Constants.COURSE_TABLE)
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String code;
    private String name;
    private Integer credits;
    private Integer duration;
    private String description;

    /**
     * Default constructor required by JPA.
     */
    public Course() {}

    /**
     * Constructor to populate entity fields from a CourseDTO.
     *
     * @param courseDTO Data Transfer Object for Course
     */
    public Course(CourseDTO courseDTO) {
        this.code = courseDTO.getCode();
        this.name = courseDTO.getName();
        this.credits = courseDTO.getCredits();
        this.duration = courseDTO.getDuration();
        this.description = courseDTO.getDescription();
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public Integer getCredits() {
        return credits;
    }

    public void setCredits(Integer credits) {
        this.credits = credits;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
