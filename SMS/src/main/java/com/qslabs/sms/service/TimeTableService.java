package com.qslabs.sms.service;

import com.qslabs.sms.dto.TimeTableDTO;
import com.qslabs.sms.dto.TimeTableDTO;
import com.qslabs.sms.model.TimeTable;
import java.util.List;

public interface TimeTableService {
    List<TimeTableDTO> getAllTimeTables();
    TimeTableDTO getTimeTableById(Long id);
    TimeTableDTO createTimeTable(TimeTable timeTable);
    TimeTableDTO updateTimeTable(Long id, TimeTable updatedTimeTable);
    boolean deleteTimeTable(Long id);
}
