package com.qslabs.sms.dto;

import java.util.Date;
import java.util.List;

/**
 * Data Transfer Object (DTO) for Student.
 * This class is used to transfer student-related data between layers of the application.
 */
public class StudentDTO {

    private Long studentId;
    private String firstName;
    private String lastName;
    private Date dateOfBirth;
    private String gender;
    private String address;
    private String contactNumber;
    private String nationality;
    private HealthRecordDTO healthRecord;
    private List<ParentGuardianDTO> parents;

    /**
     * Default constructor.
     */
    public StudentDTO() {
    }

    /**
     * Parameterized constructor for initializing StudentDTO.
     *
     * @param id Unique ID for the student
     * @param firstName First name of the student
     * @param lastName Last name of the student
     * @param dateOfBirth Date of birth of the student
     * @param gender Gender of the student
     * @param address Address of the student
     * @param contactNumber Contact number of the student
     * @param nationality Nationality of the student
     * @param healthRecord Associated health record of the student
     * @param parents List of parents/guardians related to the student
     */
    public StudentDTO(Long id, String firstName, String lastName, Date dateOfBirth, String gender, String address, String contactNumber, String nationality, HealthRecordDTO healthRecord, List<ParentGuardianDTO> parents) {
        this.studentId = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.dateOfBirth = dateOfBirth;
        this.gender = gender;
        this.address = address;
        this.contactNumber = contactNumber;
        this.nationality = nationality;
        this.healthRecord = healthRecord;
        this.parents = parents;
    }

    /**
     * Gets the student ID.
     *
     * @return id
     */
    public Long getId() {
        return studentId;
    }

    /**
     * Sets the student ID.
     *
     * @param id Unique ID to set
     */
    public void setId(Long id) {
        this.studentId = id;
    }

    /**
     * Gets the first name of the student.
     *
     * @return firstName
     */
    public String getFirstName() {
        return firstName;
    }

    /**
     * Sets the first name of the student.
     *
     * @param firstName First name to set
     */
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    /**
     * Gets the last name of the student.
     *
     * @return lastName
     */
    public String getLastName() {
        return lastName;
    }

    /**
     * Sets the last name of the student.
     *
     * @param lastName Last name to set
     */
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    /**
     * Gets the date of birth of the student.
     *
     * @return dateOfBirth
     */
    public Date getDateOfBirth() {
        return dateOfBirth;
    }

    /**
     * Sets the date of birth of the student.
     *
     * @param dateOfBirth Date of birth to set
     */
    public void setDateOfBirth(Date dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    /**
     * Gets the gender of the student.
     *
     * @return gender
     */
    public String getGender() {
        return gender;
    }

    /**
     * Sets the gender of the student.
     *
     * @param gender Gender to set
     */
    public void setGender(String gender) {
        this.gender = gender;
    }

    /**
     * Gets the address of the student.
     *
     * @return address
     */
    public String getAddress() {
        return address;
    }

    /**
     * Sets the address of the student.
     *
     * @param address Address to set
     */
    public void setAddress(String address) {
        this.address = address;
    }

    /**
     * Gets the contact number of the student.
     *
     * @return contactNumber
     */
    public String getContactNumber() {
        return contactNumber;
    }

    /**
     * Sets the contact number of the student.
     *
     * @param contactNumber Contact number to set
     */
    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    /**
     * Gets the nationality of the student.
     *
     * @return nationality
     */
    public String getNationality() {
        return nationality;
    }

    /**
     * Sets the nationality of the student.
     *
     * @param nationality Nationality to set
     */
    public void setNationality(String nationality) {
        this.nationality = nationality;
    }

    /**
     * Gets the associated health record of the student.
     *
     * @return healthRecord
     */
    public HealthRecordDTO getHealthRecord() {
        return healthRecord;
    }

    /**
     * Sets the associated health record of the student.
     *
     * @param healthRecord Health record to set
     */
    public void setHealthRecord(HealthRecordDTO healthRecord) {
        this.healthRecord = healthRecord;
    }

    /**
     * Gets the list of parents/guardians associated with the student.
     *
     * @return parents
     */
    public List<ParentGuardianDTO> getParents() {
        return parents;
    }

    /**
     * Sets the list of parents/guardians associated with the student.
     *
     * @param parents List of ParentGuardianDTO to set
     */
    public void setParents(List<ParentGuardianDTO> parents) {
        this.parents = parents;
    }
}
