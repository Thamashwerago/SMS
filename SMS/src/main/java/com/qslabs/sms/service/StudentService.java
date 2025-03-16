package com.qslabs.sms.service;

import com.qslabs.sms.dto.StudentDTO;
import com.qslabs.sms.model.Student;
import java.util.List;

/**
 * Interface for managing student records.
 * Provides method signatures to retrieve, add, update, and delete students.
 */
public interface StudentService {

    /**
     * Retrieves all students with pagination.
     *
     * @param limit Number of students per page
     * @param offset Starting point for fetching students
     * @return List of StudentDTO containing paginated student records
     */
    List<StudentDTO> getAllStudents(int limit, int offset);

    /**
     * Retrieves a student by ID.
     *
     * @param id ID of the student
     * @return StudentDTO containing student details if found, otherwise null
     */
    StudentDTO getStudentById(Long id);

    /**
     * Adds a new student record.
     *
     * @param student The student details to be added
     * @return StudentDTO representation of the saved student
     */
    StudentDTO addStudent(Student student);

    /**
     * Updates an existing student record.
     *
     * @param id ID of the student to be updated
     * @param updatedStudent The updated student details
     * @return StudentDTO containing updated record if successful, otherwise null
     */
    StudentDTO updateStudent(Long id, Student updatedStudent);

    /**
     * Deletes a student record by ID.
     *
     * @param id ID of the student to be deleted
     * @return true if deletion was successful, false if a student not found
     */
    boolean deleteStudent(Long id);
}
