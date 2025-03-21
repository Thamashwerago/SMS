package com.qslabs.sms.controller;

import com.qslabs.sms.dto.AttendanceDTO;
import com.qslabs.sms.service.AttendanceService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

// TODO Util Package-constant class-hard quoted values
// Base URL must be placed outside  - api/attendance

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "*") // Allow frontend requests (Optional)
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @PostMapping
    public ResponseEntity<AttendanceDTO> markAttendance(@Valid @RequestBody AttendanceDTO attendanceDTO) {
        AttendanceDTO savedAttendance = attendanceService.markAttendance(attendanceDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedAttendance);
    }
// TODO Add pagination - as a new method to get students (1-10, 11-20..)
    @GetMapping("/{studentId}")
    public ResponseEntity<List<AttendanceDTO>> getAttendance(
            @PathVariable Long studentId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<AttendanceDTO> attendanceList = attendanceService.getAttendanceByStudent(studentId, date);
        return ResponseEntity.ok(attendanceList);
    }
}
