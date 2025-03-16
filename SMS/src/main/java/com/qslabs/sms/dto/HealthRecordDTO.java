package com.qslabs.sms.dto;

/**
 * Data Transfer Object (DTO) for HealthRecord.
 * This class is used to transfer health record data between layers of the application.
 */
public class HealthRecordDTO {

    private Long healthId;
    private String medicalHistory;
    private String vaccinationDetails;
    private String emergencyContact;

    /**
     * Default constructor.
     */
    public HealthRecordDTO() {
    }

    /**
     * Parameterized constructor for initializing HealthRecordDTO.
     *
     * @param id Unique ID for the health record
     * @param medicalHistory Medical history details
     * @param vaccinationDetails Vaccination details
     * @param emergencyContact Emergency contact information
     */
    public HealthRecordDTO(Long id, String medicalHistory, String vaccinationDetails, String emergencyContact) {
        this.healthId = id;
        this.medicalHistory = medicalHistory;
        this.vaccinationDetails = vaccinationDetails;
        this.emergencyContact = emergencyContact;
    }

    /**
     * Gets the health record ID.
     *
     * @return healthId
     */
    public Long getId() {
        return healthId;
    }

    /**
     * Sets the health record ID.
     *
     * @param id Unique ID to set
     */
    public void setId(Long id) {
        this.healthId = id;
    }

    /**
     * Gets the medical history details.
     *
     * @return medicalHistory
     */
    public String getMedicalHistory() {
        return medicalHistory;
    }

    /**
     * Sets the medical history details.
     *
     * @param medicalHistory Medical history to set
     */
    public void setMedicalHistory(String medicalHistory) {
        this.medicalHistory = medicalHistory;
    }

    /**
     * Gets the vaccination details.
     *
     * @return vaccinationDetails
     */
    public String getVaccinationDetails() {
        return vaccinationDetails;
    }

    /**
     * Sets the vaccination details.
     *
     * @param vaccinationDetails Vaccination details to set
     */
    public void setVaccinationDetails(String vaccinationDetails) {
        this.vaccinationDetails = vaccinationDetails;
    }

    /**
     * Gets the emergency contact information.
     *
     * @return emergencyContact
     */
    public String getEmergencyContact() {
        return emergencyContact;
    }

    /**
     * Sets the emergency contact information.
     *
     * @param emergencyContact Emergency contact to set
     */
    public void setEmergencyContact(String emergencyContact) {
        this.emergencyContact = emergencyContact;
    }
}

