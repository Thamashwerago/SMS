package com.qslabs.sms.controller;

import com.qslabs.sms.dto.AttendanceDTO;
import com.qslabs.sms.dto.AttendanceSummaryDTO;
import com.qslabs.sms.service.AttendanceService;
import com.qslabs.sms.util.Constants;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

// TODO Util Package-constant class-hard quoted values
// Base URL must be placed outside  - api/attendance

/**
 * Controller for handling attendance-related API endpoints.
 */
@RestController
@RequestMapping(Constants.REQUEST_MAPPING_ATTENDANCE) // Base URL for all attendance APIs
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @GetMapping
    public Page<AttendanceDTO> getAllAttendance(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size, @RequestParam(defaultValue = "id") String sortBy, @RequestParam(defaultValue = "true") boolean ascending) {

        Sort sort = ascending ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return attendanceService.getAllAttendance(pageable);
    }

    /**
     * Marks attendance for a student. Only accessible by users with ROLE_ADMIN.
     *
     * @param attendanceDTO DTO containing attendance data
     * @return Created attendance record
     */
    @Secured({"ROLE_ADMIN","ROLE_TEACHER"})
    @PostMapping
    public ResponseEntity<AttendanceDTO> markAttendance(@Valid @RequestBody AttendanceDTO attendanceDTO) {
        return new ResponseEntity<>(attendanceService.markAttendance(attendanceDTO), HttpStatus.CREATED);
    }

// TODO Add pagination - as a new method to get students (1-10, 11-20..)
    /**
     * Retrieves attendance records for a specific student within an optional date range.
     *
     * @param studentId ID of the student
     * @param startDate (Optional) Start date for filtering
     * @param endDate   (Optional) End date for filtering
     * @return List of attendance records
     */
    @GetMapping("/studentwithdate/{studentId}")
    public ResponseEntity<List<AttendanceDTO>> getAttendance(
            @PathVariable Long studentId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<AttendanceDTO> attendanceList = attendanceService.getAttendanceByStudentAndDate(studentId, startDate, endDate);
        return ResponseEntity.ok(attendanceList);
    }

    /**
     * Fetches a single attendance record by its ID.
     *
     * @param id ID of the attendance record
     * @return AttendanceDTO object
     */
    @GetMapping("/{id}")
    public ResponseEntity<AttendanceDTO> getAttendanceById(@PathVariable Long id) {
        return ResponseEntity.ok(attendanceService.getAttendanceById(id));
    }

    /**
     * Retrieves all attendance records for a specific student.
     *
     * @param id ID of the student
     * @return List of attendance records
     */
    @GetMapping("/student/{id}")
    public ResponseEntity<List<AttendanceDTO>> getAttendanceByStudentId(@PathVariable Long id) {
        List<AttendanceDTO> attendanceList  = attendanceService.getAttendanceByStudent(id);
        return ResponseEntity.ok(attendanceList);
    }

    /**
     * Retrieves all attendance records for a specific course.
     *
     * @param id ID of the course
     * @return List of attendance records
     */
    @GetMapping("/course/{id}")
    public ResponseEntity<List<AttendanceDTO>> getAttendanceByCourceId(@PathVariable Long id) {
        List<AttendanceDTO> attendanceList  = attendanceService.getAttendanceByCourse(id);
        return ResponseEntity.ok(attendanceList);
    }

    /**
     * Retrieves attendance records filtered by both student ID and course ID.
     *
     * @param studentId ID of the student
     * @param courseId  ID of the course
     * @return List of attendance records
     */
    @GetMapping("/")
    public ResponseEntity<List<AttendanceDTO>> getAttendanceByStudentIdAndCourceId(@RequestParam Long studentId, @RequestParam Long courseId) {
        List<AttendanceDTO> attendanceList = attendanceService.getAttendanceByStudentAndCourse(studentId, courseId);
        return ResponseEntity.ok(attendanceList);
    }

    /**
     * Updates an existing attendance record. Only accessible by users with ROLE_ADMIN.
     *
     * @param id            ID of the record to update
     * @param attendanceDTO Updated attendance data
     * @return Updated attendance record
     */
    @Secured({"ROLE_ADMIN","ROLE_TEACHER"})
    @PutMapping("/{id}")
    public ResponseEntity<AttendanceDTO> updateAttendance(@PathVariable Long id, @RequestBody AttendanceDTO attendanceDTO) {
        return ResponseEntity.ok(attendanceService.updateAttendance(id, attendanceDTO));
    }

    /**
     * Deletes (unmarks) an attendance record. Only accessible by users with ROLE_ADMIN.
     *
     * @param id ID of the record to delete
     * @return No content response
     */
    @Secured({"ROLE_ADMIN","ROLE_TEACHER"})
    @DeleteMapping("/{id}")
    public ResponseEntity<AttendanceDTO> deleteAttendance(@PathVariable Long id) {
        attendanceService.unMarkAttendance(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/summary")
    public ResponseEntity<List<AttendanceSummaryDTO>> getAttendanceSummary(
            @RequestParam("from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam("to") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @RequestParam(value = "courseId", required = false) Long courseId,
            @RequestParam(value = "role", required = false) String role) {

        List<AttendanceSummaryDTO> result = attendanceService.getAttendanceSummaryDTO(from, to, courseId, role);
        return ResponseEntity.ok(result);
    }

}
