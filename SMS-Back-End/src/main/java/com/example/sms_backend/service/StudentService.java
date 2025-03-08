package com.example.sms_backend.service;

import com.example.sms_backend.dto.StudentDTO;
import com.example.sms_backend.model.Student;
import com.example.sms_backend.repository.StudentRepository;
import com.example.sms_backend.util.ValidationUtil;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class StudentService {
    // todo change to a interface and only signature , create another class called StudentServiceImpl class

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    // Convert Student Entity to DTO
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

    /**
     * Retrieves paginated students.
     *
     * @param pageable Pageable object for pagination.
     * @return Page of StudentDTOs.
     */
    public Page<StudentDTO> getAllStudents(Pageable pageable) {
        return studentRepository.findAll(pageable)
                .map(this::convertToDTO);
    }

    // Fetch a student by ID
    public StudentDTO getStudentById(Long id) {
        Optional<Student> student = studentRepository.findById(id);
        return student.map(this::convertToDTO).orElse(null);
    }

    // Add a new student
    public StudentDTO addStudent(Student student) {
        if (ValidationUtil.isNotEmpty(student.getFirstName()) ||
                ValidationUtil.isNotEmpty(student.getLastName())) {
            throw new IllegalArgumentException("Name fields cannot be empty");
        }
        if (!ValidationUtil.isValidPhoneNumber(student.getContactNumber())) {
            throw new IllegalArgumentException("Invalid phone number format");
        }
        Student savedStudent = studentRepository.save(student);
        return convertToDTO(savedStudent);
    }

    // Update an existing student
    public StudentDTO updateStudent(Long id, Student updatedStudent) {
        if (studentRepository.existsById(id)) {
            updatedStudent.setId(id);
            Student savedStudent = studentRepository.save(updatedStudent);
            return convertToDTO(savedStudent);
        }
        return null; // Handle case where student doesn't exist
    }

    // Delete a student by ID
    public boolean deleteStudent(Long id) {
        if (studentRepository.existsById(id)) {
            studentRepository.deleteById(id);
            return true;
        }
        return false;
    }
}