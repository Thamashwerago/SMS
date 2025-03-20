package com.qslabs.sms.dto;

import com.qslabs.sms.model.TimeTable;

import java.time.LocalDate;
import java.time.LocalTime;

public class TimeTableDTO {
    private Long id;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private String teacherName;
    private String courseName;
    private String classroom;
    private Long teacherId;

    // Constructors, Getters, and Setters
    public TimeTableDTO() {}

    public TimeTableDTO(Long id, LocalDate date, LocalTime startTime, LocalTime endTime,Long teacherId, String courseName, String classroom) {
        this.id = id;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.teacherId = teacherId;
        this.courseName = courseName;
        this.classroom = classroom;
    }

    public TimeTableDTO(TimeTable timetable){
        this.id = timetable.getId();
        this.date = timetable.getDate();
        this.startTime = timetable.getStartTime();
        this.endTime = timetable.getEndTime();
        this.courseName = timetable.getClassroom();
        this.teacherId = timetable.getTeacherId();
        this.classroom = classroom;

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

    public String getTeacherName() {
        return teacherName;
    }

    public void setTeacherName(String teacherName) {
        this.teacherName = teacherName;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public String getClassroom() {
        return classroom;
    }

    public void setClassroom(String classroom) {
        this.classroom = classroom;
    }
}
