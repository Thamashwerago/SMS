package com.qslab.sms.service;

import com.qslab.sms.dto.CourseDTO;
import com.qslab.sms.model.Course;
import com.qslab.sms.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;

    // Convert Entity to DTO
    private CourseDTO convertToDTO(Course course) {
        CourseDTO dto = new CourseDTO();
        dto.setId(course.getId());
        dto.setCourseName(course.getCourseName());
        dto.setSyllabus(course.getSyllabus());
        dto.setMaxCapacity(course.getMaxCapacity());
        dto.setTeacherId(course.getTeacherId());
        dto.setStudentIds(course.getStudentIds());
        return dto;
    }

    // Get all courses
    public List<CourseDTO> getAllCourses() {
        return courseRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get course by ID
    public CourseDTO getCourseById(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        return convertToDTO(course);
    }

    // Create a new course
    public CourseDTO createCourse(CourseDTO dto) {
        if (courseRepository.existsByCourseName(dto.getCourseName())) {
            throw new RuntimeException("Course with the same name already exists.");
        }
        Course course = new Course();
        course.setCourseName(dto.getCourseName());
        course.setSyllabus(dto.getSyllabus());
        course.setMaxCapacity(dto.getMaxCapacity());
        course.setTeacherId(dto.getTeacherId());
        course.setStudentIds(dto.getStudentIds());

        return convertToDTO(courseRepository.save(course));
    }

    // Update a course
    public CourseDTO updateCourse(Long id, CourseDTO dto) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        course.setCourseName(dto.getCourseName());
        course.setSyllabus(dto.getSyllabus());
        course.setMaxCapacity(dto.getMaxCapacity());
        course.setTeacherId(dto.getTeacherId());
        course.setStudentIds(dto.getStudentIds());

        return convertToDTO(courseRepository.save(course));
    }

    // Delete a course
    public void deleteCourse(Long id) {
        if (!courseRepository.existsById(id)) {
            throw new RuntimeException("Course not found");
        }
        courseRepository.deleteById(id);
    }

    // Enroll student in a course
    public CourseDTO enrollStudent(Long courseId, Long studentId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        if (course.getStudentIds().contains(studentId)) {
            throw new RuntimeException("Student already enrolled");
        }

        course.getStudentIds().add(studentId);
        return convertToDTO(courseRepository.save(course));
    }

    // Assign teacher to a course
    public CourseDTO assignTeacher(Long courseId, Long teacherId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        course.setTeacherId(teacherId);
        return convertToDTO(courseRepository.save(course));
    }
}
