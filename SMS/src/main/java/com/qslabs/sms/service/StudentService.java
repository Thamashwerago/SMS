package com.qslabs.sms.service;

import com.qslabs.sms.dto.StudentDTO;
import com.qslabs.sms.model.Student;
import com.qslabs.sms.repository.StudentRepository;
import com.qslabs.sms.util.ExcelHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentService {

    private static final String PROFILE_PICTURE_DIR = "uploads/";

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public List<StudentDTO> getAllStudents() {
        return studentRepository.findAll()
                .stream()
                .map(StudentDTO::new)
                .collect(Collectors.toList());
    }

    public StudentDTO getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return new StudentDTO(student);
    }

    public StudentDTO createStudent(StudentDTO studentDTO) {
        Student student = new Student();
        return getStudentDTO(studentDTO, student);
    }

    private StudentDTO getStudentDTO(StudentDTO studentDTO, Student student) {
        student.setFirstName(studentDTO.getFirstName());
        student.setLastName(studentDTO.getLastName());
        student.setEmail(studentDTO.getEmail());
        student.setRollNumber(studentDTO.getRollNumber());
        student.setStudentClass(studentDTO.getStudentClass());
        student = studentRepository.save(student);
        return new StudentDTO(student);
    }

    public StudentDTO updateStudent(Long id, StudentDTO studentDTO) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        return getStudentDTO(studentDTO, student);
    }

    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }

    public String uploadProfilePicture(Long studentId, MultipartFile file) {
        try {
            Student student = studentRepository.findById(studentId)
                    .orElseThrow(() -> new RuntimeException("Student not found"));

            Path uploadPath = Paths.get(PROFILE_PICTURE_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String fileName = studentId + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            student.setProfilePicture("/uploads/" + fileName);
            studentRepository.save(student);

            return student.getProfilePicture();
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file", e);
        }
    }

    // Export students to Excel
    public ByteArrayInputStream exportStudentsToExcel() {
        List<Student> students = studentRepository.findAll();
        return ExcelHelper.studentsToExcel(students);
    }

    // Import students from Excel
    public void importStudentsFromExcel(MultipartFile file) {
        if (!ExcelHelper.isExcelFormat(file)) {
            throw new RuntimeException("Invalid file format! Upload only Excel files.");
        }
        try {
            List<Student> students = ExcelHelper.excelToStudents(file.getInputStream());
            studentRepository.saveAll(students);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store student data: " + e.getMessage());
        }
    }
}
