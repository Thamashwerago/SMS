package com.qslabs.sms.controller;

import com.qslabs.sms.dto.TimeTableDTO;
import com.qslabs.sms.exception.TimeTableNotFoundException;
import com.qslabs.sms.service.TimeTableService;
import com.qslabs.sms.util.Constant;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(Constant.URL)
public class TimeTableController {

    @Autowired
    private TimeTableService service;

    @GetMapping
    public ResponseEntity<List<TimeTableDTO>> getAllTimeTables() {
        return ResponseEntity.ok(service.getAllTimeTables());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TimeTableDTO> getTimeTableById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getTimeTableById(id));
    }

    @PostMapping
    public ResponseEntity<TimeTableDTO> createTimeTable(@RequestBody @Valid TimeTableDTO timeTableDTO) {
        return ResponseEntity.ok(service.createTimeTable(timeTableDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TimeTableDTO> updateTimeTable(@PathVariable Long id, @RequestBody @Valid TimeTableDTO timeTableDTO) {
        return ResponseEntity.ok(service.updateTimeTable(id, timeTableDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<TimeTableDTO> deleteTimeTable(@PathVariable Long id) {
        service.deleteTimeTable(id);
        return ResponseEntity.noContent().build();
    }
}
