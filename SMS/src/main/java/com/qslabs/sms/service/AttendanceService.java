package com.qslabs.sms.service;

import com.qslabs.sms.dto.AttendanceDTO;
import com.qslabs.sms.model.Attendance;
import com.qslabs.sms.repository.AttendanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

// TODO class->interface
// only signature
//Create a new class - AttendanceServiceImpl - Move below code to it
// Implement from AttendanceService
// Create a NotFoundException (Super class)- studentIdNotFound (inherited class)
@Service
public class AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    public AttendanceDTO markAttendance(AttendanceDTO attendanceDTO) {
        Attendance attendance = new Attendance(
                attendanceDTO.getStudentId(),
                LocalDate.now(),
                attendanceDTO.getStatus()
        );
        Attendance savedAttendance = attendanceRepository.save(attendance);
        return new AttendanceDTO(savedAttendance);
    }

    public List<AttendanceDTO> getAttendanceByStudent(Long studentId, LocalDate date) {
        LocalDate startOfDay = date != null ? date : LocalDate.now();
        LocalDate endOfDay = startOfDay;

        List<Attendance> attendanceList = attendanceRepository.findByStudentIdAndDateBetween(studentId, startOfDay, endOfDay);
        return attendanceList.stream()
                .map(AttendanceDTO::new)
                .collect(Collectors.toList());
    }
}
