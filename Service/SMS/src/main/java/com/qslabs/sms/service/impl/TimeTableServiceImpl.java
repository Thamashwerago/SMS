package com.qslabs.sms.service.impl;

import com.qslabs.sms.dto.TimeTableDTO;
import com.qslabs.sms.exception.TimetableNotFoundException;
import com.qslabs.sms.model.TimeTable;
import com.qslabs.sms.repository.TimeTableRepository;
import com.qslabs.sms.service.TimeTableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

/**
 * Implementation of the TimeTableService interface.
 * Provides business logic for managing timetable records for courses.
 */
@Service
public class TimeTableServiceImpl implements TimeTableService {

    @Autowired
    private  TimeTableRepository repository;


    /**
     * Retrieves all timetable entries with pagination.
     *
     * @param pageable object containing page number, size, and sorting
     * @return paginated list of TimeTableDTOs
     */
    @Override
    public Page<TimeTableDTO> getAllTimeTables(Pageable pageable) {
        return repository.findAll(pageable).map(TimeTableDTO::new);
    }

    /**
     * Fetches a single timetable record by its ID.
     *
     * @param id timetable ID
     * @return TimeTableDTO of the matched record
     * @throws TimetableNotFoundException if no record is found
     */
    @Override
    @Cacheable(value = "timetable", key = "#id")
    public TimeTableDTO getTimeTableById(Long id) {
        TimeTable timeTable = repository.findById(id).orElseThrow(TimetableNotFoundException::new);
        return new TimeTableDTO(timeTable);
    }

    /**
     * Creates a new timetable entry.
     *
     * @param timeTableDTO data to create a timetable
     * @return created timetable as DTO
     */
    @Override
    @CachePut(value = "timetable", key = "#result.id")
    @CacheEvict(value = "todayClassCount", allEntries = true)
    public TimeTableDTO createTimeTable(TimeTableDTO timeTableDTO) {
        TimeTable timeTable = new TimeTable(timeTableDTO);
        timeTable = repository.save(timeTable);
        return new TimeTableDTO(timeTable);
    }

    /**
     * Updates an existing timetable record.
     *
     * @param id            ID of the timetable to update
     * @param timeTableDTO  updated values
     * @return updated timetable as DTO
     * @throws TimetableNotFoundException if no record is found with the given ID
     */
    @Override
    @CachePut(value = "timetable", key = "#id")
    @CacheEvict(value = "todayClassCount", allEntries = true)
    public TimeTableDTO updateTimeTable(Long id, TimeTableDTO timeTableDTO) {
        TimeTable timeTable = repository.findById(id).orElseThrow(() -> new TimetableNotFoundException(" with id: " + id));

        timeTable.setDate(timeTableDTO.getDate());
        timeTable.setStartTime(timeTableDTO.getStartTime());
        timeTable.setEndTime(timeTableDTO.getEndTime());
        timeTable.setTeacherId(timeTableDTO.getTeacherId());
        timeTable.setCourseId(timeTableDTO.getCourseId());
        timeTable.setClassroom(timeTableDTO.getClassroom());
        timeTable = repository.save(timeTable);
        return new TimeTableDTO(timeTable);
    }

    /**
     * Deletes a timetable record by its ID.
     *
     * @param id timetable ID
     * @return true if deletion was successful
     * @throws TimetableNotFoundException if the record doesn't exist
     */
    @Override
    @CacheEvict(value = { "timetable", "todayClassCount" }, key = "#id")
    public boolean deleteTimeTable(Long id) {
        TimeTable timeTable = repository.findById(id).orElseThrow(() -> new TimetableNotFoundException(" with id: " + id));
        repository.delete(timeTable);
        return true;
    }

    @Override
    @Cacheable("todayClassCount")
    public Long getTodayClassCount() {
        return repository.getTodayClassCount(LocalDate.now());
    }
}
