package com.example.sms_backend.controller;

import com.example.sms_backend.model.HealthRecord;
import com.example.sms_backend.service.HealthRecordService;
import com.example.sms_backend.util.Constants;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Controller for managing student health records.
 * Provides endpoints for retrieving, adding, updating, and deleting health records.
 */
@RestController
@RequestMapping(Constants.REQUEST_MAPPING_HEALTH)
public class HealthRecordController {

    private final HealthRecordService healthRecordService;

    /**
     * Constructor for injecting the HealthRecordService dependency.
     *
     * @param healthRecordService Service layer handling health record operations.
     */
    public HealthRecordController(HealthRecordService healthRecordService) {
        this.healthRecordService = healthRecordService;
    }

    /**
     * Retrieves the health record for a specific student.
     *
     * @param studentId The ID of the student whose health record is requested.
     * @return ResponseEntity containing a structured response.
     */
    @GetMapping(Constants.GET_MAPPING)
    public ResponseEntity<?> getHealthRecordByStudentId(@PathVariable Long studentId) {
        HealthRecord record = healthRecordService.getHealthRecordByStudentId(studentId);
        Map<String, Object> response = new HashMap<>();

        if (record == null) {
            response.put(Constants.MESSAGE, String.format(Constants.HEALTH_RECORD_NOT_FOUND, studentId));
            return ResponseEntity.status(404).body(response);
        }

        response.put(Constants.MESSAGE, String.format(Constants.HEALTH_RECORD_FOUND, studentId));
        response.put(Constants.HEALTH_RECORD, record);
        return ResponseEntity.ok(response);
    }

    /**
     * Adds a new health record for a student.
     *
     * @param healthRecord The health record data to be added.
     * @return ResponseEntity containing a success message and the created health record.
     */
    @PostMapping
    public ResponseEntity<?> addHealthRecord(@RequestBody HealthRecord healthRecord) {
        HealthRecord savedRecord = healthRecordService.addHealthRecord(healthRecord);

        // Construct response with message
        Map<String, Object> response = new HashMap<>();
        response.put(Constants.MESSAGE, String.format(Constants.HEALTH_RECORD_ADDED, savedRecord.getId()));
        response.put(Constants.HEALTH_RECORD, savedRecord);

        return ResponseEntity.status(201).body(response);
    }

    /**
     * Updates an existing health record.
     *
     * @param id The ID of the health record to update.
     * @param updatedRecord The updated health record data.
     * @return ResponseEntity containing a structured response.
     */
    @PutMapping(Constants.PUT_MAPPING)
    public ResponseEntity<?> updateHealthRecord(@PathVariable Long id, @RequestBody HealthRecord updatedRecord) {
        HealthRecord record = healthRecordService.updateHealthRecord(id, updatedRecord);
        Map<String, Object> response = new HashMap<>();

        if (record == null) {
            response.put(Constants.MESSAGE, String.format(Constants.HEALTH_RECORD_NOT_FOUND, id));
            return ResponseEntity.status(404).body(response);
        }

        response.put(Constants.MESSAGE, String.format(Constants.HEALTH_RECORD_UPDATED, id));
        response.put(Constants.HEALTH_RECORD, record);
        return ResponseEntity.ok(response);
    }

    /**
     * Deletes a health record.
     *
     * @param id The ID of the health record to delete.
     * @return ResponseEntity with a structured response.
     */
    @DeleteMapping(Constants.DELETE_MAPPING)
    public ResponseEntity<?> deleteHealthRecord(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();

        if (!healthRecordService.deleteHealthRecord(id)) {
            response.put(Constants.MESSAGE, String.format(Constants.HEALTH_RECORD_NOT_FOUND, id));
            return ResponseEntity.status(404).body(response);
        }

        response.put(Constants.MESSAGE, String.format(Constants.HEALTH_RECORD_DELETED, id));
        return ResponseEntity.ok(response);
    }
}

