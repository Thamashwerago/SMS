package com.qslabs.sms.repository;

import com.qslabs.sms.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    List<Student> findByFirstNameContainingIgnoreCase(String firstName);
    List<Student> findByRollNumber(String rollNumber);
    List<Student> findByStudentClass(String studentClass);
}
