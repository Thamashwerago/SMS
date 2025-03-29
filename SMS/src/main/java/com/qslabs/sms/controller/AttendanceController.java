package com.qslabs.sms.controller;

import com.qslabs.sms.dto.AttendanceDTO;
import com.qslabs.sms.service.AttendanceService;
import com.qslabs.sms.service.AttendanceServiceimpl;
import com.qslabs.sms.util.Constant;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

// TODO Util Package-constant class-hard quoted values
// Base URL must be placed outside  - api/attendance

@RestController
@RequestMapping(Constant.URL) // Allow frontend requests (Optional)
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @PostMapping
    public ResponseEntity<AttendanceDTO> markAttendance(@Valid @RequestBody AttendanceDTO attendanceDTO) {
        return new ResponseEntity<>(attendanceService.markAttendance(attendanceDTO), HttpStatus.CREATED);
    }

    // TODO Add pagination - as a new method to get students (1-10, 11-20..)
    @GetMapping("/studentwithdate/{studentId}")
    public ResponseEntity<List<AttendanceDTO>> getAttendance(
            @PathVariable Long studentId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<AttendanceDTO> attendanceList = attendanceService.getAttendanceByStudentAndDate(studentId, startDate, endDate);
        return ResponseEntity.ok(attendanceList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AttendanceDTO> getAttendanceById(@PathVariable Long id) {
        return ResponseEntity.ok(attendanceService.getAttendanceById(id));
    }

    @GetMapping("/student/{id}")
    public ResponseEntity<List<AttendanceDTO>> getAttendanceByStudentId(@PathVariable Long id) {
        List<AttendanceDTO> attendanceList  = attendanceService.getAttendanceByStudent(id);
        return ResponseEntity.ok(attendanceList);
    }

    @GetMapping("/course/{id}")
    public ResponseEntity<List<AttendanceDTO>> getAttendanceByCourceId(@PathVariable Long id) {
        List<AttendanceDTO> attendanceList  = attendanceService.getAttendanceByCourse(id);
        return ResponseEntity.ok(attendanceList);
    }

    @GetMapping("/")
    public ResponseEntity<List<AttendanceDTO>> getAttendanceByStudentIdAndCourceId(@RequestParam Long studentId, @RequestParam Long courseId) {
        List<AttendanceDTO> attendanceList = attendanceService.getAttendanceByStudentAndCourse(studentId, courseId);
        return ResponseEntity.ok(attendanceList);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AttendanceDTO> updateAttendance(@PathVariable Long id, @RequestBody AttendanceDTO attendanceDTO) {
        return ResponseEntity.ok(attendanceService.updateAttendance(id, attendanceDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<AttendanceDTO> deleteAttendance(@PathVariable Long id) {
        attendanceService.unMarkAttendance(id);
        return ResponseEntity.noContent().build();
    }

}
