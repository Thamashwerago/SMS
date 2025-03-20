package com.qslabs.sms.repository;

import com.qslabs.sms.model.TimeTable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TimeTableRepository extends JpaRepository<TimeTable, Long> {
    List<TimeTable> findByTeacherId(Long teacherId);
    List<TimeTable> findByCourseId(Long courseId);
}
