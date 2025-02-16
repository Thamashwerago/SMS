package com.qslabs.sms.service;

import com.qslabs.sms.dto.TeacherDTO;
import com.qslabs.sms.exception.ResourceNotFoundException;
import com.qslabs.sms.model.Teacher;
import com.qslabs.sms.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TeacherService {
    @Autowired
    private TeacherRepository teacherRepository;

    public List<TeacherDTO> getAllTeachers() {
        return teacherRepository.findAll().stream()
                .map(TeacherDTO::new)
                .collect(Collectors.toList());
    }

    public TeacherDTO getTeacherById(Long id) {
        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));
        return new TeacherDTO(teacher);
    }

    public TeacherDTO createTeacher(TeacherDTO teacherDTO) {
        Teacher teacher = new Teacher(teacherDTO);
        teacher = teacherRepository.save(teacher);
        return new TeacherDTO(teacher);
    }

    public TeacherDTO updateTeacher(Long id, TeacherDTO teacherDTO) {
        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + id));

        teacher.setName(teacherDTO.getName());
        teacher.setEmail(teacherDTO.getEmail());
        teacher.setPassword(teacherDTO.getPassword());
        teacher.setPhone(teacherDTO.getPhone());
        teacher.setDob(teacherDTO.getDob());
        teacher.setGender(teacherDTO.getGender());
        teacher.setAddress(teacherDTO.getAddress());
        teacher.setJoiningDate(teacherDTO.getJoiningDate());
        teacher.setStatus(teacherDTO.getStatus());
        teacher.setRole(teacherDTO.getRole());

        teacher = teacherRepository.save(teacher);
        return new TeacherDTO(teacher);
    }

    public void deleteTeacher(Long id) {
        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + id));

        teacherRepository.delete(teacher);
    }
}
