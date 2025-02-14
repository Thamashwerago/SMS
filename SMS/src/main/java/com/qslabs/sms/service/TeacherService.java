package com.qslabs.sms.service;

import com.qslabs.sms.dto.TeacherDTO;
import com.qslabs.sms.exception.ResourceNotFoundException;
import com.qslabs.sms.model.Teacher;
import com.qslabs.sms.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TeacherService {
    @Autowired
    private TeacherRepository teacherRepository;

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
}
