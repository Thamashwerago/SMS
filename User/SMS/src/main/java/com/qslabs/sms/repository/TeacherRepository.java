package com.qslabs.sms.repository;

import com.qslabs.sms.model.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
// Todo
// Add custom method with custom query
public interface TeacherRepository extends JpaRepository<Teacher, Long> {
}
