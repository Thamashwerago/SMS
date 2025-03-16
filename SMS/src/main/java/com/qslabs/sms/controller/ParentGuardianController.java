package com.qslabs.sms.controller;

import com.qslabs.sms.model.ParentGuardian;
import com.qslabs.sms.service.ParentGuardianService;
import com.qslabs.sms.util.Constants;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for managing parent/guardian records.
 * Provides endpoints to retrieve, add, update, and delete parent/guardian information.
 */
@RestController
@RequestMapping(Constants.REQUEST_MAPPING_PARENT)
public class ParentGuardianController {

    private final ParentGuardianService parentGuardianService;

    /**
     * Constructor for dependency injection of ParentGuardianService.
     *
     * @param parentGuardianService Service to handle parent/guardian operations
     */
    public ParentGuardianController(ParentGuardianService parentGuardianService) {
        this.parentGuardianService = parentGuardianService;
    }

    /**
     * Retrieves all parents/guardians associated with a student ID.
     *
     * @param studentId ID of the student
     * @return ResponseEntity containing the list of parents/guardians
     */
    @GetMapping(Constants.GET_MAPPING_PARENT)
    public ResponseEntity<List<ParentGuardian>> getParentsByStudentId(@PathVariable Long studentId) {
        return ResponseEntity.ok(parentGuardianService.getParentsByStudentId(studentId));
    }

    /**
     * Adds a new parent/guardian record.
     *
     * @param parentGuardian The parent/guardian details to be added
     * @return ResponseEntity containing the added parent/guardian record
     */
    @PostMapping
    public ResponseEntity<ParentGuardian> addParent(@RequestBody ParentGuardian parentGuardian) {
        return ResponseEntity.ok(parentGuardianService.addParent(parentGuardian));
    }

    /**
     * Updates an existing parent/guardian record.
     *
     * @param id ID of the parent/guardian to be updated
     * @param updatedParent The updated parent/guardian details
     * @return ResponseEntity containing the updated record if successful, otherwise a 404 response
     */
    @PutMapping(Constants.PUT_MAPPING_PARENT)
    public ResponseEntity<ParentGuardian> updateParent(@PathVariable Long id, @RequestBody ParentGuardian updatedParent) {
        ParentGuardian parent = parentGuardianService.updateParent(id, updatedParent);
        return parent != null ? ResponseEntity.ok(parent) : ResponseEntity.notFound().build();
    }

    /**
     * Deletes a parent/guardian record by ID.
     *
     * @param id ID of the parent/guardian to be deleted
     * @return ResponseEntity with no content if successful, otherwise a 404 response
     */
    @DeleteMapping(Constants.DELETE_MAPPING_PARENT)
    public ResponseEntity<Void> deleteParent(@PathVariable Long id) {
        return parentGuardianService.deleteParent(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
