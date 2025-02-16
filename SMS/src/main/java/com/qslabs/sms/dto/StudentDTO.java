package com.qslabs.sms.dto;

import com.qslabs.sms.model.Student;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StudentDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String rollNumber;
    private String studentClass;
    private String profilePicture; // URL to access profile picture

    public StudentDTO(Student student) {
        this.id = student.getId();
        this.firstName = student.getFirstName();
        this.lastName = student.getLastName();
        this.email = student.getEmail();
        this.rollNumber = student.getRollNumber();
        this.studentClass = student.getStudentClass();
        this.profilePicture = student.getProfilePicture();
    }

    // Getters and Setters
}
