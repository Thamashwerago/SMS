package com.qslabs.sms.controller;

import com.qslabs.sms.model.HealthRecord;
import com.qslabs.sms.service.HealthRecordService;
import com.qslabs.sms.util.Constants;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for managing HealthRecord operations.
 * Provides endpoints for creating, retrieving, updating, and deleting health records.
 */
@RestController
@RequestMapping(Constants.REQUEST_MAPPING_HEALTH)
public class HealthRecordController {

    private final HealthRecordService healthRecordService;

    /**
     * Constructor for HealthRecordController.
     * Uses constructor-based dependency injection to set the HealthRecordService.
     *
     * @param healthRecordService the service handling health record operations.
     */
    public HealthRecordController(HealthRecordService healthRecordService) {
        this.healthRecordService = healthRecordService;
    }

    /**
     * Fetch a health record by student ID.
     * This endpoint returns the health record associated with the given student ID.
     *
     * @param studentId the ID of the student whose health record is requested.
     * @return a ResponseEntity containing the HealthRecord if found, otherwise a 404 Not Found.
     */
    @GetMapping(Constants.GET_MAPPING_HEALTH)
    public ResponseEntity<HealthRecord> getHealthRecordByStudentId(@PathVariable Long studentId) {
        HealthRecord record = healthRecordService.getHealthRecordByStudentId(studentId);
        return record != null ? ResponseEntity.ok(record) : ResponseEntity.notFound().build();
    }

    /**
     * Add a new health record.
     * This endpoint creates a new health record entry based on the provided JSON payload.
     *
     * @param healthRecord the HealthRecord object to be created.
     * @return a ResponseEntity containing the newly created HealthRecord.
     */
    @PostMapping
    public ResponseEntity<HealthRecord> addHealthRecord(@RequestBody HealthRecord healthRecord) {
        return ResponseEntity.ok(healthRecordService.addHealthRecord(healthRecord));
    }

    /**
     * Update an existing health record.
     * This endpoint updates the health record with the given ID using the provided data.
     *
     * @param id the ID of the health record to update.
     * @param updatedRecord the HealthRecord object containing updated information.
     * @return a ResponseEntity containing the updated HealthRecord if found, otherwise a 404 Not Found.
     */
    @PutMapping(Constants.PUT_MAPPING_HEALTH)
    public ResponseEntity<HealthRecord> updateHealthRecord(@PathVariable Long id, @RequestBody HealthRecord updatedRecord) {
        HealthRecord record = healthRecordService.updateHealthRecord(id, updatedRecord);
        return record != null ? ResponseEntity.ok(record) : ResponseEntity.notFound().build();
    }

    /**
     * Delete a health record.
     * This endpoint deletes the health record with the specified ID.
     *
     * @param id the ID of the health record to delete.
     * @return a ResponseEntity with no content if deletion is successful, otherwise a 404 Not Found.
     */
    @DeleteMapping(Constants.DELETE_MAPPING_HEALTH)
    public ResponseEntity<Void> deleteHealthRecord(@PathVariable Long id) {
        return healthRecordService.deleteHealthRecord(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
