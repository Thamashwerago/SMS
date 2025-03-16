package com.qslabs.sms.service;

import com.qslabs.sms.model.ParentGuardian;
import com.qslabs.sms.repository.ParentGuardianRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service class for handling operations related to ParentGuardian entities.
 * Provides methods to retrieve, add, update, and delete parent/guardian records.
 */
@Service
public class ParentGuardianService {

    private final ParentGuardianRepository parentGuardianRepository;

    /**
     * Constructor for ParentGuardianService.
     * Uses constructor-based dependency injection to initialize the ParentGuardianRepository.
     *
     * @param parentGuardianRepository the repository for parent/guardian operations.
     */
    public ParentGuardianService(ParentGuardianRepository parentGuardianRepository) {
        this.parentGuardianRepository = parentGuardianRepository;
    }

    /**
     * Retrieve all ParentGuardian records associated with a specific student ID.
     *
     * @param studentId the unique identifier of the student.
     * @return a list of ParentGuardian entities associated with the given student.
     */
    public List<ParentGuardian> getParentsByStudentId(Long studentId) {
        return parentGuardianRepository.findByStudentId(studentId);
    }

    /**
     * Add a new ParentGuardian record.
     *
     * @param parentGuardian the ParentGuardian object to be added.
     * @return the saved ParentGuardian entity.
     */
    public ParentGuardian addParent(ParentGuardian parentGuardian) {
        return parentGuardianRepository.save(parentGuardian);
    }

    /**
     * Update an existing ParentGuardian record.
     *
     * If the record exists, the updated parent's ID is set to the provided ID and saved.
     * Otherwise, returns null indicating the record does not exist.
     *
     * @param id the unique identifier of the ParentGuardian record to update.
     * @param updatedParent the ParentGuardian object containing updated information.
     * @return the updated ParentGuardian if successful, or null if the record does not exist.
     */
    public ParentGuardian updateParent(Long id, ParentGuardian updatedParent) {
        if (parentGuardianRepository.existsById(id)) {
            // Ensure the updated record uses the correct ID.
            updatedParent.setId(id);
            return parentGuardianRepository.save(updatedParent);
        }
        // Return null if the record to update does not exist.
        return null;
    }

    /**
     * Delete a ParentGuardian record by its ID.
     *
     * Checks if the record exists before attempting deletion.
     *
     * @param id the unique identifier of the ParentGuardian record to delete.
     * @return true if deletion was successful, false otherwise.
     */
    public boolean deleteParent(Long id) {
        if (parentGuardianRepository.existsById(id)) {
            parentGuardianRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
