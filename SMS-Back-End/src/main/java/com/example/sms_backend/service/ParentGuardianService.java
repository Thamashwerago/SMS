package com.example.sms_backend.service;

import com.example.sms_backend.model.ParentGuardian;
import com.example.sms_backend.repository.ParentGuardianRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ParentGuardianService {

    private final ParentGuardianRepository parentGuardianRepository;

    public ParentGuardianService(ParentGuardianRepository parentGuardianRepository) {
        this.parentGuardianRepository = parentGuardianRepository;
    }

    // Get all parents/guardians by student ID
    public List<ParentGuardian> getParentsByStudentId(Long studentId) {
        return parentGuardianRepository.findByStudentId(studentId);
    }

    // Add a new parent/guardian
    public ParentGuardian addParent(ParentGuardian parentGuardian) {
        return parentGuardianRepository.save(parentGuardian);
    }

    // Update an existing parent/guardian
    public ParentGuardian updateParent(Long id, ParentGuardian updatedParent) {
        if (parentGuardianRepository.existsById(id)) {
            updatedParent.setId(id);
            return parentGuardianRepository.save(updatedParent);
        }
        return null; // Handle case where parent doesn't exist
    }

    // Delete a parent/guardian by ID
    public boolean deleteParent(Long id) {
        if (parentGuardianRepository.existsById(id)) {
            parentGuardianRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
