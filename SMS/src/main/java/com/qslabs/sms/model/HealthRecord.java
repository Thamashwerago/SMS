package com.qslabs.sms.model;

import com.qslabs.sms.util.Constants;
import jakarta.persistence.*;

/**
 * Entity class representing a HealthRecord.
 * This class is mapped to the "health_records" table in the database.
 */
@Entity
@Table(name = Constants.HEALTH_TABLE)
public class HealthRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long healthId;

    private String medicalHistory;
    private String vaccinationDetails;
    private String emergencyContact;

    /**
     * One-to-One relationship with Student.
     * The foreign key column in the HealthRecord table is "studentId".
     */
    @OneToOne
    @JoinColumn(name = Constants.STUDENT_ID_COLUMN)
    private Student student;

    /**
     * Default constructor.
     */
    public HealthRecord() {
    }

    /**
     * Parameterized constructor for initializing a HealthRecord.
     *
     * @param student The associated Student entity.
     * @param medicalHistory Medical history details.
     * @param vaccinationDetails Vaccination details.
     * @param emergencyContact Emergency contact information.
     */
    public HealthRecord(Student student, String medicalHistory, String vaccinationDetails, String emergencyContact) {
        this.student = student;
        this.medicalHistory = medicalHistory;
        this.vaccinationDetails = vaccinationDetails;
        this.emergencyContact = emergencyContact;
    }

    /**
     * Gets the HealthRecord ID.
     *
     * @return the health_id.
     */
    public Long getId() {
        return healthId;
    }

    /**
     * Sets the HealthRecord ID.
     *
     * @param id the health_id to set.
     */
    public void setId(Long id) {
        this.healthId = id;
    }

    /**
     * Gets the medical history.
     *
     * @return the medicalHistory.
     */
    public String getMedicalHistory() {
        return medicalHistory;
    }

    /**
     * Sets the medical history.
     *
     * @param medicalHistory the medicalHistory to set.
     */
    public void setMedicalHistory(String medicalHistory) {
        this.medicalHistory = medicalHistory;
    }

    /**
     * Gets the vaccination details.
     *
     * @return the vaccinationDetails.
     */
    public String getVaccinationDetails() {
        return vaccinationDetails;
    }

    /**
     * Sets the vaccination details.
     *
     * @param vaccinationDetails the vaccinationDetails to set.
     */
    public void setVaccinationDetails(String vaccinationDetails) {
        this.vaccinationDetails = vaccinationDetails;
    }

    /**
     * Gets the emergency contact information.
     *
     * @return the emergencyContact.
     */
    public String getEmergencyContact() {
        return emergencyContact;
    }

    /**
     * Sets the emergency contact information.
     *
     * @param emergencyContact the emergencyContact to set.
     */
    public void setEmergencyContact(String emergencyContact) {
        this.emergencyContact = emergencyContact;
    }

    /**
     * Gets the associated Student.
     *
     * @return the student.
     */
    public Student getStudent() {
        return student;
    }

    /**
     * Sets the associated Student.
     *
     * @param student the student to set.
     */
    public void setStudent(Student student) {
        this.student = student;
    }
}
