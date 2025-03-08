package com.example.sms_backend.repository;

import com.example.sms_backend.model.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    /**
     * Retrieves paginated student data.
     *
     * @param pageable Pageable object for pagination.
     * @return Page of Students.
     */
    Page<Student> findAll(Pageable pageable);
}
// todo add custom query