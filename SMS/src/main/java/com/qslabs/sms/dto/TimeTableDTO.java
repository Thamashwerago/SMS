package com.qslabs.sms.dto;

import com.qslabs.sms.model.TimeTable;

import java.time.LocalDate;
import java.time.LocalTime;

public class TimeTableDTO {
    private Long id;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private Long teacherId;
    private Long courseId;
    private String classroom;

    // Constructors, Getters, and Setters
    public TimeTableDTO() {}

    public TimeTableDTO(LocalDate date, LocalTime startTime, LocalTime endTime,Long teacherId, Long courseId, String classroom) {
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.teacherId = teacherId;
        this.courseId = courseId;
        this.classroom = classroom;
    }

    public TimeTableDTO(TimeTable timetable){
        this.id = timetable.getId();
        this.date = timetable.getDate();
        this.startTime = timetable.getStartTime();
        this.endTime = timetable.getEndTime();
        this.courseId = timetable.getCourseId();
        this.teacherId = timetable.getTeacherId();
        this.classroom = timetable.getClassroom();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public String getClassroom() {
        return classroom;
    }

    public void setClassroom(String classroom) {
        this.classroom = classroom;
    }

    public Long getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(Long teacherId) {
        this.teacherId = teacherId;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }
}
