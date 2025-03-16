package com.qslabs.sms.service;

import com.qslabs.sms.dto.StudentDTO;
import com.qslabs.sms.model.Student;
import com.qslabs.sms.repository.StudentRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Implementation of the StudentService interface.
 * Provides concrete methods to manage student records and handle data conversion.
 */
@Service
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;

    /**
     * Constructor for dependency injection of StudentRepository.
     *
     * @param studentRepository Repository for student data
     */
    public StudentServiceImpl(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    /**
     * Converts a Student entity to a StudentDTO.
     *
     * @param student Student entity
     * @return StudentDTO representation of the student entity
     */
    private StudentDTO convertToDTO(Student student) {
        StudentDTO dto = new StudentDTO();
        dto.setId(student.getId());
        dto.setFirstName(student.getFirstName());
        dto.setLastName(student.getLastName());
        dto.setDateOfBirth(student.getDateOfBirth());
        dto.setGender(student.getGender());
        dto.setAddress(student.getAddress());
        dto.setContactNumber(student.getContactNumber());
        dto.setNationality(student.getNationality());
        return dto;
    }

    @Override
    public List<StudentDTO> getAllStudents(int limit, int offset) {
        List<Student> students = studentRepository.findAll().stream()
                .skip(offset)
                .limit(limit)
                .toList();
        return students.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public StudentDTO getStudentById(Long id) {
        Optional<Student> student = studentRepository.findById(id);
        return student.map(this::convertToDTO).orElse(null);
    }

    @Override
    public StudentDTO addStudent(Student student) {
        Student savedStudent = studentRepository.save(student);
        return convertToDTO(savedStudent);
    }

    @Override
    public StudentDTO updateStudent(Long id, Student updatedStudent) {
        if (studentRepository.existsById(id)) {
            updatedStudent.setId(id);
            Student savedStudent = studentRepository.save(updatedStudent);
            return convertToDTO(savedStudent);
        }
        return null; // Handle case where a student doesn't exist
    }

    @Override
    public boolean deleteStudent(Long id) {
        if (studentRepository.existsById(id)) {
            studentRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
