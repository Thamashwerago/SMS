package com.qslabs.sms.repository;

import com.qslabs.sms.model.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;


// TODO Create two methods - with custom query - I should create a query and pass data
/**
 * Repository interface for Attendance entity.
 * Provides built-in CRUD operations and custom query methods.
 */
@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    /**
     * Finds attendance records for a user between two dates.
     *
     * @param studentId the user ID (usually student)
     * @param startDate start date for filtering
     * @param endDate   end date for filtering
     * @return List of matching attendance records
     */
    List<Attendance> findByUserIdAndDateBetween(Long studentId, LocalDate startDate, LocalDate endDate);
    /**
     * Finds all attendance records for a specific user.
     *
     * @param userId user ID
     * @return List of attendance records
     */
    List<Attendance> findByUserId(Long userId);
    /**
     * Finds all attendance records for a specific course.
     *
     * @param courseId course ID
     * @return List of attendance records
     */
    List<Attendance> findByCourseId(Long courseId);
    /**
     * Finds attendance records by both user and course.
     *
     * @param userId   user ID
     * @param courseId course ID
     * @return List of attendance records
     */
    List<Attendance> findByUserIdAndCourseId(Long userId, Long courseId);

    @Query("""
    SELECT a.userId, a.role, a.courseId,
           COUNT(a) AS totalCount,
           SUM(CASE WHEN a.status = 'PRESENT' THEN 1 ELSE 0 END) AS presentCount
    FROM Attendance a
    WHERE a.date BETWEEN :fromDate AND :toDate
      AND (:courseId IS NULL OR a.courseId = :courseId)
      AND (:role IS NULL OR a.role = :role)
    GROUP BY a.userId, a.role, a.courseId
""")
    List<Object[]> getRawAttendanceSummary(@Param("fromDate") LocalDate fromDate, @Param("toDate") LocalDate toDate, @Param("courseId") Long courseId, @Param("role") String role);

}
