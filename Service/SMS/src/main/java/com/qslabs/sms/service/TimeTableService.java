package com.qslabs.sms.service;

import com.qslabs.sms.dto.TimeTableDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service interface for managing course timetables.
 * Provides methods for creating, retrieving, updating, and deleting timetable entries.
 */
public interface TimeTableService {

    /**
     * Retrieves all timetable records with pagination.
     *
     * @param pageable object containing page number, size, and sort details
     * @return paginated list of TimeTableDTOs
     */
    Page<TimeTableDTO> getAllTimeTables(Pageable pageable);

    /**
     * Retrieves a specific timetable entry by its ID.
     *
     * @param id the timetable ID
     * @return TimeTableDTO containing timetable details
     */
    TimeTableDTO getTimeTableById(Long id);

    /**
     * Creates a new timetable entry.
     *
     * @param timeTableDTO data required to create a timetable
     * @return the newly created TimeTableDTO
     */
    TimeTableDTO createTimeTable(TimeTableDTO timeTableDTO);

    /**
     * Updates an existing timetable entry by ID.
     *
     * @param id            the ID of the timetable to update
     * @param timeTableDTO  the updated timetable data
     * @return updated TimeTableDTO
     */
    TimeTableDTO updateTimeTable(Long id, TimeTableDTO timeTableDTO);

    /**
     * Deletes a timetable entry by its ID.
     *
     * @param id the ID of the timetable to delete
     * @return true if deletion was successful, false otherwise
     */
    boolean deleteTimeTable(Long id);

    Long getTodayClassCount();
}
