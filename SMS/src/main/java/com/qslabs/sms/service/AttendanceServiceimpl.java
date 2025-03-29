package com.qslabs.sms.service;

import com.qslabs.sms.dto.AttendanceDTO;
import com.qslabs.sms.exception.ResourceNotFoundException;
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
public class AttendanceServiceimpl implements AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Override
    public AttendanceDTO markAttendance(AttendanceDTO attendanceDTO) {
        Attendance attendance = new Attendance(attendanceDTO);
        attendance = attendanceRepository.save(attendance);
        return new AttendanceDTO(attendance);
    }

    @Override
    public AttendanceDTO getAttendanceById(Long id) {
        Attendance attendance = attendanceRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Attendance not found"));
        return new AttendanceDTO(attendance);
    }

    @Override
    public AttendanceDTO updateAttendance(Long id, AttendanceDTO attendanceDTO) {
        Attendance attendance = attendanceRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Attendance not found with id: " + id));

        attendance.setStudentId(attendanceDTO.getStudentId());
        attendance.setCourseId(attendanceDTO.getCourseId());
        attendance.setDate(attendanceDTO.getDate());
        attendance.setStatus(attendanceDTO.getStatus());

        attendance = attendanceRepository.save(attendance);
        return new AttendanceDTO(attendance);
    }

    @Override
    public void unMarkAttendance(Long id) {
        attendanceRepository.deleteById(id);
    }

    @Override
    public List<AttendanceDTO> getAttendanceByStudentAndDate(Long studentId, LocalDate startDate, LocalDate endDate) {
        List<Attendance> attendanceList = attendanceRepository.findByStudentIdAndDateBetween(studentId, startDate, endDate);
        return attendanceList.stream()
                .map(AttendanceDTO::new)
                .collect(Collectors.toList());
    }

    @Override
    public List<AttendanceDTO> getAttendanceByStudent(Long studentId) {
        List<Attendance> attendanceList = attendanceRepository.findByStudentId(studentId);
        return attendanceList.stream().map(AttendanceDTO::new).collect(Collectors.toList());
    }

    @Override
    public List<AttendanceDTO> getAttendanceByCourse(Long courseId) {
        List<Attendance> attendanceList = attendanceRepository.findByCourseId(courseId);
        return attendanceList.stream().map(AttendanceDTO::new).collect(Collectors.toList());
    }

    @Override
    public List<AttendanceDTO> getAttendanceByStudentAndCourse(Long studentId, Long courseId) {
        List<Attendance> attendanceList = attendanceRepository.findByStudentIdAndCourseId(studentId, courseId);
        return attendanceList.stream().map(AttendanceDTO::new).collect(Collectors.toList());
    }
}
