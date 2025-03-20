package com.qslabs.sms.service;

import com.qslabs.sms.dto.TimeTableDTO;
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
        TimeTable timeTable = repository.findById(id).orElseThrow(null);
        return new TimeTableDTO(timeTable);
    }

    @Override
    public TimeTableDTO createTimeTable(TimeTable timeTable) {
        return null;
    }

    @Override
    public TimeTableDTO updateTimeTable(Long id, TimeTable updatedTimeTable) {
        if (!repository.existsById(id)) {
            throw new TimeTableNotFoundException(id);
        }
        Optional<TimeTable> timeTable = repository.findById(id);
        timeTable.get().setEndTime(updatedTimeTable.getEndTime());
        timeTable.get().setClassroom(updatedTimeTable.getClassroom());
        timeTable.get().setTeacherId(updatedTimeTable.getTeacherId());
        timeTable.get().setCourseId(updatedTimeTable.getCourseId());
        timeTable.get().setClassroom(updatedTimeTable.getClassroom());
        timeTable = repository.save(timeTable);

        return new TimeTableDTO(timeTable.orElse(null));
    }

    @Override
    public boolean deleteTimeTable(Long id) {
        if (!repository.existsById(id)) {
            throw new TimeTableNotFoundException(id);
        }
        repository.deleteById(id);
        return true;
    }
}
