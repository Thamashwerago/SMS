package com.qslabs.sms.controller;

import com.qslabs.sms.dto.TimeTableDTO;
import com.qslabs.sms.exception.TimeTableNotFoundException;
import com.qslabs.sms.service.TimeTableService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/timetable")
public class TimeTableController {

    private final TimeTableService service;

    public TimeTableController(TimeTableService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<TimeTableDTO>> getAllTimeTables() {
        return ResponseEntity.ok(service.getAllTimeTables());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TimeTableDTO> getTimeTableById(@PathVariable Long id) {
        return service.getTimeTableById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new TimeTableNotFoundException(id));
    }
}
