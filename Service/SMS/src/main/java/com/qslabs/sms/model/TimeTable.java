package com.qslabs.sms.model;

import com.qslabs.sms.dto.TimeTableDTO;
import com.qslabs.sms.util.Constants;
import jakarta.persistence.*;
import org.apache.tomcat.util.bcel.Const;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Entity representing a timetable entry for classes.
 * Maps to the database table defined by {@link Constants#TIMETABLE_TABLE}.
 */
@Entity
@Table(name = Constants.TIMETABLE_TABLE)
public class TimeTable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private Long teacherId;
    private Long courseId;
    private String classroom;

    /**
     * Default constructor required by JPA.
     */
    public TimeTable() {}

    /**
     * Constructor to initialize entity from a TimeTableDTO.
     *
     * @param timeTableDTO DTO containing timetable data
     */
    public TimeTable(TimeTableDTO timeTableDTO) {
        this.date = timeTableDTO.getDate();
        this.startTime = timeTableDTO.getStartTime();
        this.endTime = timeTableDTO.getEndTime();
        this.teacherId = timeTableDTO.getTeacherId();
        this.courseId = timeTableDTO.getCourseId();
        this.classroom = timeTableDTO.getClassroom();
    }

    public String getClassroom() {
        return classroom;
    }

    public void setClassroom(String classroom) {
        this.classroom = classroom;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public Long getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(Long teacherId) {
        this.teacherId = teacherId;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
