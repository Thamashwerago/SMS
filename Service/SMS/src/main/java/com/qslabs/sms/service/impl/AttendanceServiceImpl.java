package com.qslabs.sms.service.impl;

import com.qslabs.sms.dto.AttendanceDTO;
import com.qslabs.sms.exception.AttendanceNotFoundException;
import com.qslabs.sms.model.Attendance;
import com.qslabs.sms.repository.AttendanceRepository;
import com.qslabs.sms.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

// TODO class->interface
// only signature
//Create a new class - AttendanceServiceImpl - Move below code to it
// Implement from AttendanceService
// Create a NotFoundException (Super class)- studentIdNotFound (inherited class)

/**
 * Implementation of the AttendanceService interface.
 * Handles business logic related to student attendance records.
 */
@Service
public class AttendanceServiceImpl implements AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    /**
     * Marks attendance for a student in a course.
     *
     * @param attendanceDTO the attendance data to save
     * @return the saved attendance record as a DTO
     */
    @Override
    public AttendanceDTO markAttendance(AttendanceDTO attendanceDTO) {
        Attendance attendance = new Attendance(attendanceDTO);
        attendance = attendanceRepository.save(attendance);
        return new AttendanceDTO(attendance);
    }

    /**
     * Retrieves a specific attendance record by its ID.
     *
     * @param id the attendance record ID
     * @return the attendance data as a DTO
     */
    @Override
    @Cacheable(value = "attendance", key = "#id")
    public AttendanceDTO getAttendanceById(Long id) {
        Attendance attendance = attendanceRepository.findById(id).orElseThrow(AttendanceNotFoundException::new);
        return new AttendanceDTO(attendance);
    }

    /**
     * Updates an existing attendance record.
     *
     * @param id            the ID of the record to update
     * @param attendanceDTO the updated attendance data
     * @return the updated attendance as a DTO
     */
    @Override
    @CachePut(value = "attendance", key = "#id")
    public AttendanceDTO updateAttendance(Long id, AttendanceDTO attendanceDTO) {
        Attendance attendance = attendanceRepository.findById(id).orElseThrow(() -> new AttendanceNotFoundException(" with id: " + id));

        attendance.setUserId(attendanceDTO.getUserId());
        attendance.setCourseId(attendanceDTO.getCourseId());
        attendance.setDate(attendanceDTO.getDate());
        attendance.setStatus(attendanceDTO.getStatus());

        attendance = attendanceRepository.save(attendance);
        return new AttendanceDTO(attendance);
    }

    /**
     * Deletes (unmarks) an attendance record by its ID.
     *
     * @param id the ID of the attendance record to delete
     */
    @Override
    @CacheEvict(value = "attendance", key = "#id")
    public void unMarkAttendance(Long id) {
        attendanceRepository.deleteById(id);
    }

    /**
     * Retrieves attendance records for a specific student within a date range.
     *
     * @param studentId the student ID
     * @param startDate the start date for filtering
     * @param endDate   the end date for filtering
     * @return list of attendance records as DTOs
     */
    @Override
    public List<AttendanceDTO> getAttendanceByStudentAndDate(Long studentId, LocalDate startDate, LocalDate endDate) {
        List<Attendance> attendanceList = attendanceRepository.findByUserIdAndDateBetween(studentId, startDate, endDate);
        return attendanceList.stream()
                .map(AttendanceDTO::new)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves all attendance records for a specific student.
     *
     * @param userId the student/user ID
     * @return list of attendance records as DTOs
     */
    @Override
    @Cacheable(value = "attendanceByStudent", key = "#userId")
    public List<AttendanceDTO> getAttendanceByStudent(Long userId) {
        List<Attendance> attendanceList = attendanceRepository.findByUserId(userId);
        return attendanceList.stream().map(AttendanceDTO::new).collect(Collectors.toList());
    }

    /**
     * Retrieves all attendance records for a specific course.
     *
     * @param courseId the course ID
     * @return list of attendance records as DTOs
     */
    @Override
    @Cacheable(value = "attendanceByCourse", key = "#courseId")
    public List<AttendanceDTO> getAttendanceByCourse(Long courseId) {
        List<Attendance> attendanceList = attendanceRepository.findByCourseId(courseId);
        return attendanceList.stream().map(AttendanceDTO::new).collect(Collectors.toList());
    }

    /**
     * Retrieves attendance records for a student in a specific course.
     *
     * @param studentId the student ID
     * @param courseId  the course ID
     * @return list of attendance records as DTOs
     */
    @Override
    @Cacheable(value = "attendanceByStudentCourse", key = "#studentId + '_' + #courseId")
    public List<AttendanceDTO> getAttendanceByStudentAndCourse(Long studentId, Long courseId) {
        List<Attendance> attendanceList = attendanceRepository.findByUserIdAndCourseId(studentId, courseId);
        return attendanceList.stream().map(AttendanceDTO::new).collect(Collectors.toList());
    }
}
