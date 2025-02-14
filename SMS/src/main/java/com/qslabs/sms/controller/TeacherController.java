package com.qslabs.sms.controller;

import com.qslabs.sms.dto.TeacherDTO;
import com.qslabs.sms.model.Teacher;
import com.qslabs.sms.service.TeacherService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/teachers")
public class TeacherController {

        @Autowired
        private TeacherService teacherService;

        @GetMapping("/{id}")
        public ResponseEntity<TeacherDTO> getTeacherById(@PathVariable Long id) {
            return ResponseEntity.ok(teacherService.getTeacherById(id));
        }

        @PostMapping
        public ResponseEntity<TeacherDTO> createTeacher(@RequestBody @Valid TeacherDTO teacherDTO) {
            return new ResponseEntity<>(teacherService.createTeacher(teacherDTO), HttpStatus.CREATED);
        }
}

