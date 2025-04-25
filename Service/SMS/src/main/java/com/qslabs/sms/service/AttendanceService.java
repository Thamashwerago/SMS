package com.qslabs.sms.service;

import com.qslabs.sms.dto.AttendanceDTO;
import com.qslabs.sms.dto.AttendanceSummaryDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

/**
 * Service interface for managing student attendance records.
 * Defines core operations such as marking, updating, retrieving, and deleting attendance.
 */
public interface AttendanceService {

    /**
     * Marks a student's attendance for a specific date and course.
     *
     * @param attendanceDTO attendance data to be saved
     * @return the saved attendance record as DTO
     */
    AttendanceDTO markAttendance(AttendanceDTO attendanceDTO);

    /**
     * Retrieves a specific attendance record by its ID.
     *
     * @param id the ID of the attendance record
     * @return AttendanceDTO of the record
     */
    AttendanceDTO getAttendanceById(Long id);

    /**
     * Updates an existing attendance record.
     *
     * @param id            the ID of the attendance record to update
     * @param attendanceDTO updated attendance data
     * @return updated AttendanceDTO
     */
    AttendanceDTO updateAttendance(Long id,AttendanceDTO attendanceDTO);

    /**
     * Deletes (unmarks) an attendance record by its ID.
     *
     * @param id the ID of the record to delete
     */
    void unMarkAttendance(Long id);

    /**
     * Retrieves attendance records for a student within a specific date range.
     *
     * @param studentId the student's user ID
     * @param startDate start date of the range
     * @param endDate   end date of the range
     * @return list of AttendanceDTOs
     */
    List<AttendanceDTO> getAttendanceByStudentAndDate(Long studentId, LocalDate startDate, LocalDate endDate);

    /**
     * Retrieves all attendance records for a specific student.
     *
     * @param studentId the student's user ID
     * @return list of AttendanceDTOs
     */
    List<AttendanceDTO> getAttendanceByStudent(Long studentId);

    /**
     * Retrieves all attendance records for a specific course.
     *
     * @param courseId the course ID
     * @return list of AttendanceDTOs
     */
    List<AttendanceDTO> getAttendanceByCourse(Long courseId);

    /**
     * Retrieves attendance records for a student in a specific course.
     *
     * @param studentId the student's user ID
     * @param courseId  the course ID
     * @return list of AttendanceDTOs
     */
    List<AttendanceDTO> getAttendanceByStudentAndCourse(Long studentId, Long courseId);

    Page<AttendanceDTO> getAllAttendance(Pageable pageable);

    List<AttendanceSummaryDTO> getAttendanceSummaryDTO(LocalDate fromDate, LocalDate toDate, Long courseId, String role);
}
