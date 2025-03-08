package com.example.sms_backend.controller;

import com.example.sms_backend.model.ParentGuardian;
import com.example.sms_backend.service.ParentGuardianService;
import com.example.sms_backend.util.Constants;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controller for managing parent/guardian information.
 * Provides endpoints for retrieving, adding, updating, and deleting parent/guardian records.
 */
@RestController
@RequestMapping(Constants.REQUEST_MAPPING_PARENT)
public class ParentGuardianController {

    private final ParentGuardianService parentGuardianService;

    /**
     * Constructor to inject ParentGuardianService dependency.
     *
     * @param parentGuardianService Service layer for parent/guardian operations.
     */
    public ParentGuardianController(ParentGuardianService parentGuardianService) {
        this.parentGuardianService = parentGuardianService;
    }

    /**
     * Retrieves all parents/guardians associated with a student.
     *
     * @param studentId The ID of the student whose parents/guardians are requested.
     * @return ResponseEntity containing a structured response.
     */
    @GetMapping(Constants.GET_MAPPING)
    public ResponseEntity<?> getParentsByStudentId(@PathVariable Long studentId) {
        List<ParentGuardian> parents = parentGuardianService.getParentsByStudentId(studentId);
        Map<String, Object> response = new HashMap<>();

        if (parents.isEmpty()) {
            response.put(Constants.MESSAGE, String.format(Constants.PARENT_NOT_FOUND_FOR_STUDENT, studentId));
            return ResponseEntity.status(404).body(response);
        }

        response.put(Constants.MESSAGE, String.format(Constants.PARENT_FOUND_FOR_STUDENT, studentId));
        response.put(Constants.PARENT_GUARDIAN, parents);
        return ResponseEntity.ok(response);
    }

    /**
     * Adds a new parent/guardian for a student.
     *
     * @param parentGuardian The parent/guardian details to be added.
     * @return ResponseEntity containing a success message and the created parent/guardian record.
     */
    @PostMapping
    public ResponseEntity<?> addParent(@RequestBody ParentGuardian parentGuardian) {
        ParentGuardian savedParent = parentGuardianService.addParent(parentGuardian);

        // Construct response with message
        Map<String, Object> response = new HashMap<>();
        response.put(Constants.MESSAGE, String.format(Constants.PARENT_ADDED, savedParent.getId()));
        response.put(Constants.PARENT_GUARDIAN, savedParent);

        return ResponseEntity.status(201).body(response);
    }

    /**
     * Updates an existing parent/guardian record.
     *
     * @param id The ID of the parent/guardian record to update.
     * @param updatedParent The updated parent/guardian details.
     * @return ResponseEntity containing a structured response.
     */
    @PutMapping(Constants.PUT_MAPPING)
    public ResponseEntity<?> updateParent(@PathVariable Long id, @RequestBody ParentGuardian updatedParent) {
        ParentGuardian parent = parentGuardianService.updateParent(id, updatedParent);
        Map<String, Object> response = new HashMap<>();

        if (parent == null) {
            response.put(Constants.MESSAGE, String.format(Constants.PARENT_NOT_FOUND, id));
            return ResponseEntity.status(404).body(response);
        }

        response.put(Constants.MESSAGE, String.format(Constants.PARENT_UPDATED, id));
        response.put(Constants.PARENT_GUARDIAN, parent);
        return ResponseEntity.ok(response);
    }

    /**
     * Deletes a parent/guardian record.
     *
     * @param id The ID of the parent/guardian record to delete.
     * @return ResponseEntity with a structured response.
     */
    @DeleteMapping(Constants.DELETE_MAPPING)
    public ResponseEntity<?> deleteParent(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();

        if (!parentGuardianService.deleteParent(id)) {
            response.put(Constants.MESSAGE, String.format(Constants.PARENT_NOT_FOUND, id));
            return ResponseEntity.status(404).body(response);
        }

        response.put(Constants.MESSAGE, String.format(Constants.PARENT_DELETED, id));
        return ResponseEntity.ok(response);
    }
}

