package com.example.sms_backend.controller;

import com.example.sms_backend.model.ParentGuardian;
import com.example.sms_backend.service.ParentGuardianService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/parents")
public class ParentGuardianController {

    private final ParentGuardianService parentGuardianService;

    public ParentGuardianController(ParentGuardianService parentGuardianService) {
        this.parentGuardianService = parentGuardianService;
    }

    // Fetch all parents/guardians by student ID
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<ParentGuardian>> getParentsByStudentId(@PathVariable Long studentId) {
        return ResponseEntity.ok(parentGuardianService.getParentsByStudentId(studentId));
    }

    // Add a new parent/guardian
    @PostMapping
    public ResponseEntity<ParentGuardian> addParent(@RequestBody ParentGuardian parentGuardian) {
        return ResponseEntity.ok(parentGuardianService.addParent(parentGuardian));
    }

    // Update a parent/guardian
    @PutMapping("/{id}")
    public ResponseEntity<ParentGuardian> updateParent(@PathVariable Long id, @RequestBody ParentGuardian updatedParent) {
        ParentGuardian parent = parentGuardianService.updateParent(id, updatedParent);
        return parent != null ? ResponseEntity.ok(parent) : ResponseEntity.notFound().build();
    }

    // Delete a parent/guardian
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteParent(@PathVariable Long id) {
        return parentGuardianService.deleteParent(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
