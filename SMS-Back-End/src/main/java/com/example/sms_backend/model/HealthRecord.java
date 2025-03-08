package com.example.sms_backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "health_records")
public class HealthRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long health_id;

    private String medicalHistory;
    private String vaccinationDetails;
    private String emergencyContact;

    @OneToOne
    @JoinColumn(name = "student_id")
    private Student student;

    public HealthRecord() {
    }

    // Getters and Setters
    public Long getId() {
        return health_id;
    }

    public void setId(Long id) {
        this.health_id = id;
    }

    public String getMedicalHistory() {
        return medicalHistory;
    }

    public void setMedicalHistory(String medicalHistory) {
        this.medicalHistory = medicalHistory;
    }

    public String getVaccinationDetails() {
        return vaccinationDetails;
    }

    public void setVaccinationDetails(String vaccinationDetails) {
        this.vaccinationDetails = vaccinationDetails;
    }

    public String getEmergencyContact() {
        return emergencyContact;
    }

    public void setEmergencyContact(String emergencyContact) {
        this.emergencyContact = emergencyContact;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }
}

