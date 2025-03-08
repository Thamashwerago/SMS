package com.example.sms_backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "parents_guardians")
public class ParentGuardian {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long parent_id;

    private String name;
    private String relationship;
    private String contactNumber;
    private String email;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    public ParentGuardian() {
    }

    // Getters and Setters
    public Long getId() {
        return parent_id;
    }

    public void setId(Long id) {
        this.parent_id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRelationship() {
        return relationship;
    }

    public void setRelationship(String relationship) {
        this.relationship = relationship;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }
}
