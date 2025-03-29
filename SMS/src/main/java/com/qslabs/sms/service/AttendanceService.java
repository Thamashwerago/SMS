package com.qslabs.sms.service;

import com.qslabs.sms.dto.AttendanceDTO;
import com.qslabs.sms.model.Attendance;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceService {
    AttendanceDTO markAttendance(AttendanceDTO attendanceDTO);
    AttendanceDTO getAttendanceById(Long id);
    AttendanceDTO updateAttendance(Long id,AttendanceDTO attendanceDTO);
    void unMarkAttendance(Long id);
    List<AttendanceDTO> getAttendanceByStudentAndDate(Long studentId, LocalDate startDate, LocalDate endDate);
    List<AttendanceDTO> getAttendanceByStudent(Long studentId);
    List<AttendanceDTO> getAttendanceByCourse(Long courseId);
    List<AttendanceDTO> getAttendanceByStudentAndCourse(Long studentId, Long courseId);
}
