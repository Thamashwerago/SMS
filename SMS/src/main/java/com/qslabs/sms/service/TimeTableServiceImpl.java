package com.qslabs.sms.service;

import com.qslabs.sms.dto.TimeTableDTO;
import com.qslabs.sms.exception.ResourceNotFoundException;
import com.qslabs.sms.exception.TimeTableNotFoundException;
import com.qslabs.sms.model.TimeTable;
import com.qslabs.sms.repository.TimeTableRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TimeTableServiceImpl implements TimeTableService {

    private final TimeTableRepository repository;

    public TimeTableServiceImpl(TimeTableRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<TimeTableDTO> getAllTimeTables() {
        return repository.findAll().stream()
                .map(TimeTableDTO::new)
                .collect(Collectors.toList());
    }

    @Override
    public TimeTableDTO getTimeTableById(Long id) {
        TimeTable timeTable = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("TimeTable not found"));
        return new TimeTableDTO(timeTable);
    }

    @Override
    public TimeTableDTO createTimeTable(TimeTableDTO timeTableDTO) {
        TimeTable timeTable = new TimeTable(timeTableDTO);
        timeTable = repository.save(timeTable);
        return new TimeTableDTO(timeTable);
    }

    @Override
    public TimeTableDTO updateTimeTable(Long id, TimeTableDTO timeTableDTO) {
        TimeTable timeTable = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("TimeTable not found with id: " + id));

        timeTable.setDate(timeTableDTO.getDate());
        timeTable.setStartTime(timeTableDTO.getStartTime());
        timeTable.setEndTime(timeTableDTO.getEndTime());
        timeTable.setTeacherId(timeTableDTO.getTeacherId());
        timeTable.setCourseId(timeTableDTO.getCourseId());
        timeTable.setClassroom(timeTableDTO.getClassroom());
        timeTable = repository.save(timeTable);
        return new TimeTableDTO(timeTable);
    }

    @Override
    public boolean deleteTimeTable(Long id) {
        TimeTable timeTable = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("TimeTable  not found with id: " + id));
        repository.delete(timeTable);
        return true;
    }
}
