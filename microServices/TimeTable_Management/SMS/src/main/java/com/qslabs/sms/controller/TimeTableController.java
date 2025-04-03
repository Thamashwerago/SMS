package com.qslabs.sms.controller;

import com.qslabs.sms.dto.TimeTableDTO;
import com.qslabs.sms.service.TimeTableService;
import com.qslabs.sms.util.Constants;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for managing timetable-related operations.
 */
@RestController
@RequestMapping(Constants.REQUEST_MAPPING_TIMETABLE) // Base URL for timetable APIs
public class TimeTableController {

    @Autowired
    private TimeTableService service;

    /**
     * Retrieves all timetables with pagination and sorting.
     *
     * @param page      Page number (default = 0)
     * @param size      Number of records per page (default = 10)
     * @param sortBy    Field to sort by (default = "id")
     * @param ascending Sort direction (true = ASC, false = DESC)
     * @return Paginated list of TimeTableDTO
     */
    @GetMapping
    public ResponseEntity<Page<TimeTableDTO>> getAllTimeTables(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size, @RequestParam(defaultValue = "id") String sortBy, @RequestParam(defaultValue = "true") boolean ascending) {
        Sort sort = ascending ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(service.getAllTimeTables(pageable));
    }

    /**
     * Retrieves a timetable entry by its ID.
     *
     * @param id Timetable ID
     * @return Corresponding TimeTableDTO
     */
    @GetMapping("/{id}")
    public ResponseEntity<TimeTableDTO> getTimeTableById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getTimeTableById(id));
    }

    /**
     * Creates a new timetable record.
     * Only accessible by users with ROLE_ADMIN.
     *
     * @param timeTableDTO Timetable details
     * @return Created TimeTableDTO
     */
    @Secured("ROLE_ADMIN")
    @PostMapping
    public ResponseEntity<TimeTableDTO> createTimeTable(@RequestBody @Valid TimeTableDTO timeTableDTO) {
        return ResponseEntity.ok(service.createTimeTable(timeTableDTO));
    }

    /**
     * Updates an existing timetable record.
     * Only accessible by users with ROLE_ADMIN.
     *
     * @param id           ID of the timetable to update
     * @param timeTableDTO Updated timetable data
     * @return Updated TimeTableDTO
     */
    @Secured("ROLE_ADMIN")
    @PutMapping("/{id}")
    public ResponseEntity<TimeTableDTO> updateTimeTable(@PathVariable Long id, @RequestBody @Valid TimeTableDTO timeTableDTO) {
        return ResponseEntity.ok(service.updateTimeTable(id, timeTableDTO));
    }

    /**
     * Deletes a timetable entry by its ID.
     * Only accessible by users with ROLE_ADMIN.
     *
     * @param id ID of the timetable entry to delete
     * @return HTTP 204 No Content
     */
    @Secured("ROLE_ADMIN")
    @DeleteMapping("/{id}")
    public ResponseEntity<TimeTableDTO> deleteTimeTable(@PathVariable Long id) {
        service.deleteTimeTable(id);
        return ResponseEntity.noContent().build();
    }
}
