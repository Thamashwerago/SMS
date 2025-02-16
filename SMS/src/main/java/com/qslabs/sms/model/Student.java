package com.qslabs.sms.model;

import com.qslabs.sms.dto.StudentDTO;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "Students")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;
    private String lastName;
    private String email;
    private String rollNumber;
    private String studentClass; // e.g., "10A"
    private String profilePicture; // Stores file path for profile photo

    public Student(StudentDTO studentDTO) {

    }
}
