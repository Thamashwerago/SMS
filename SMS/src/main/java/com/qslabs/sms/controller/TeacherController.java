package com.qslabs.sms.controller;

import com.qslabs.sms.dto.TeacherDTO;
import com.qslabs.sms.model.Teacher;
import com.qslabs.sms.service.TeacherService;
import com.qslabs.sms.util.Constant;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
// Todo
// Crreate utip package and create Constant class and add hard code value ex: URL
// Get all student add pagination(limit, range) method
@RestController
@RequestMapping(Constant.URL)
public class TeacherController {

        @Autowired
        private TeacherService teacherService;

        @GetMapping
        public ResponseEntity<List<TeacherDTO>> getAllStudents() {
            return ResponseEntity.ok(teacherService.getAllTeachers());
        }

        @GetMapping("/{id}")
        public ResponseEntity<TeacherDTO> getTeacherById(@PathVariable Long id) {
            return ResponseEntity.ok(teacherService.getTeacherById(id));
        }

        @PostMapping
        public ResponseEntity<TeacherDTO> createTeacher(@RequestBody @Valid TeacherDTO teacherDTO) {
            return new ResponseEntity<>(teacherService.createTeacher(teacherDTO), HttpStatus.CREATED);
        }

        @PutMapping("/{id}")
        public ResponseEntity<TeacherDTO> updateTeacher(@PathVariable Long id, @RequestBody @Valid TeacherDTO teacherDTO) {
            return ResponseEntity.ok(teacherService.updateTeacher(id, teacherDTO));
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<Void> deleteTeacher(@PathVariable Long id) {
            teacherService.deleteTeacher(id);
            return ResponseEntity.noContent().build();
        }
}

