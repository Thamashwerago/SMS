package com.qslabs.sms.service.impl;

import com.qslabs.sms.dto.TeacherDTO;
import com.qslabs.sms.exception.TeacherNotFoundException;
import com.qslabs.sms.model.Teacher;
import com.qslabs.sms.repository.TeacherRepository;
import com.qslabs.sms.service.TeacherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
// Todo
// change this class to interface
// Create new class teacherserviceimpl to implement methods add move code
// change application.properties to yaml

/**
 * Implementation of the TeacherService interface.
 * Contains business logic for managing teacher entities.
 */
@Service
public class TeacherServiceImpl implements TeacherService {
    @Autowired
    private TeacherRepository teacherRepository;

    /**
     * Retrieves all teachers with pagination.
     *
     * @param pageable pagination configuration
     * @return paginated list of TeacherDTOs
     */
    @Override
    public Page<TeacherDTO> getAllTeachers(Pageable pageable) {
        return teacherRepository.findAll(pageable).map(TeacherDTO::new);
    }

    /**
     * Retrieves a teacher by user ID.
     *
     * @param id teacher user ID
     * @return TeacherDTO
     * @throws TeacherNotFoundException if no teacher is found
     */
    @Override
    @Cacheable(value = "teacherByUser", key = "#id")
    public TeacherDTO getTeacherByUserId(Long id) {
        Teacher teacher = teacherRepository.findByUserId(id)
                .orElseThrow(TeacherNotFoundException::new);
        return new TeacherDTO(teacher);
    }

    /**
     * Retrieves a teacher by ID.
     *
     * @param id teacher ID
     * @return TeacherDTO
     * @throws TeacherNotFoundException if no teacher is found
     */
    @Override
    @Cacheable(value = "teacher", key = "#id")
    public TeacherDTO getTeacherById(Long id) {
        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(TeacherNotFoundException::new);
        return new TeacherDTO(teacher);
    }

    /**
     * Creates a new teacher record.
     *
     * @param teacherDTO DTO containing teacher data
     * @return created TeacherDTO
     */
    @Override
    @CachePut(value = "teacher", key = "#result.id")
    public TeacherDTO createTeacher(TeacherDTO teacherDTO) {
        Teacher teacher = new Teacher(teacherDTO);
        teacher = teacherRepository.save(teacher);
        return new TeacherDTO(teacher);
    }

    /**
     * Updates an existing teacher's record.
     *
     * @param id         teacher ID
     * @param teacherDTO updated teacher data
     * @return updated TeacherDTO
     */
    @Override
    @CachePut(value = "teacher", key = "#id")
    public TeacherDTO updateTeacher(Long id, TeacherDTO teacherDTO) {
        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new TeacherNotFoundException(" with id: " + id));

        teacher.setUserId(teacherDTO.getUserId());
        teacher.setName(teacherDTO.getName());
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

    /**
     * Deletes a teacher by ID.
     *
     * @param id teacher ID
     * @throws TeacherNotFoundException if teacher is not found
     */
    @Override
    @CacheEvict(value = "teacher", key = "#id")
    public void deleteTeacher(Long id) {
        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new TeacherNotFoundException(" with id: " + id));

        teacherRepository.delete(teacher);
    }
}
