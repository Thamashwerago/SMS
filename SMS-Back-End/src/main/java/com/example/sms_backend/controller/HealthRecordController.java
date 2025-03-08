package com.example.sms_backend.controller;

import com.example.sms_backend.model.HealthRecord;
import com.example.sms_backend.service.HealthRecordService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/health-records")
public class HealthRecordController {

    private final HealthRecordService healthRecordService;

    public HealthRecordController(HealthRecordService healthRecordService) {
        this.healthRecordService = healthRecordService;
    }

    // Fetch a health record by student ID
    @GetMapping("/student/{studentId}")
    public ResponseEntity<HealthRecord> getHealthRecordByStudentId(@PathVariable Long studentId) {
        HealthRecord record = healthRecordService.getHealthRecordByStudentId(studentId);
        return record != null ? ResponseEntity.ok(record) : ResponseEntity.notFound().build();
    }

    // Add a new health record
    @PostMapping
    public ResponseEntity<HealthRecord> addHealthRecord(@RequestBody HealthRecord healthRecord) {
        return ResponseEntity.ok(healthRecordService.addHealthRecord(healthRecord));
    }

    // Update a health record
    @PutMapping("/{id}")
    public ResponseEntity<HealthRecord> updateHealthRecord(@PathVariable Long id, @RequestBody HealthRecord updatedRecord) {
        HealthRecord record = healthRecordService.updateHealthRecord(id, updatedRecord);
        return record != null ? ResponseEntity.ok(record) : ResponseEntity.notFound().build();
    }

    // Delete a health record
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHealthRecord(@PathVariable Long id) {
        return healthRecordService.deleteHealthRecord(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
