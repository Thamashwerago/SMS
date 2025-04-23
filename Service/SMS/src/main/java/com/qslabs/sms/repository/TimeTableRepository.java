package com.qslabs.sms.repository;

import com.qslabs.sms.model.TimeTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Repository interface for the TimeTable entity.
 * Provides standard CRUD operations and custom query methods.
 */
@Repository
public interface TimeTableRepository extends JpaRepository<TimeTable, Long> {
    /**
     * Retrieves all timetable entries for a given teacher.
     *
     * @param teacherId ID of the teacher
     * @return List of TimeTable entries
     */
    List<TimeTable> findByTeacherId(Long teacherId);

    /**
     * Retrieves all timetable entries for a given course.
     *
     * @param courseId ID of the course
     * @return List of TimeTable entries
     */
    List<TimeTable> findByCourseId(Long courseId);

    @Query("SELECT COUNT(t) FROM TimeTable t WHERE t.date = :today")
    Long getTodayClassCount(@Param("today") LocalDate today);
}
