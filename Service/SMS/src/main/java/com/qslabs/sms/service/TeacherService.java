package com.qslabs.sms.service;

import com.qslabs.sms.dto.TeacherDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service interface for managing Teacher entities.
 * Defines operations for creating, retrieving, updating, and deleting teacher records.
 */
public interface TeacherService {

    /**
     * Retrieves a paginated list of all teachers.
     *
     * @param pageable pagination and sorting information
     * @return paginated list of TeacherDTOs
     */
    Page<TeacherDTO> getAllTeachers(Pageable pageable);

    /**
     * Retrieves a teacher by their user ID.
     *
     * @param id the unique ID of the teacher
     * @return TeacherDTO with the teacher's details
     */
    TeacherDTO getTeacherByUserId(Long id);

    /**
     * Retrieves a teacher by their ID.
     *
     * @param id the unique ID of the teacher
     * @return TeacherDTO with the teacher's details
     */
    TeacherDTO getTeacherById(Long id);

    /**
     * Creates a new teacher record.
     *
     * @param teacherDTO the teacher data to be saved
     * @return the created TeacherDTO
     */
    TeacherDTO createTeacher(TeacherDTO teacherDTO);

    /**
     * Updates an existing teacher record.
     *
     * @param id         ID of the teacher to update
     * @param teacherDTO updated teacher data
     * @return updated TeacherDTO
     */
    TeacherDTO updateTeacher(Long id, TeacherDTO teacherDTO);

    /**
     * Deletes a teacher by their ID.
     *
     * @param id ID of the teacher to delete
     */
    void deleteTeacher(Long id);
}