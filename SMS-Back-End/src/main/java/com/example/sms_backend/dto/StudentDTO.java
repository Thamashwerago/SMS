package com.example.sms_backend.dto;

import java.util.Date;
import java.util.List;

public class StudentDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private Date dateOfBirth;
    private String gender;
    private String address;
    private String contactNumber;
    private String nationality;
    private HealthRecordDTO healthRecord;
    private List<ParentGuardianDTO> parents;

    public StudentDTO() {
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public Date getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(Date dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public String getNationality() {
        return nationality;
    }

    public void setNationality(String nationality) {
        this.nationality = nationality;
    }

    public HealthRecordDTO getHealthRecord() {
        return healthRecord;
    }

    public void setHealthRecord(HealthRecordDTO healthRecord) {
        this.healthRecord = healthRecord;
    }

    public List<ParentGuardianDTO> getParents() {
        return parents;
    }

    public void setParents(List<ParentGuardianDTO> parents) {
        this.parents = parents;
    }
}
