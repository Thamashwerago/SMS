package com.qslabs.sms.model;

import com.qslabs.sms.util.Constants;
import jakarta.persistence.*;

import java.util.Comparator;
import java.util.Date;
import java.util.List;

/**
 * Entity class representing a Student.
 * This class is mapped to the database table defined in Constants.STUDENT_TABLE.
 */
@Entity
@Table(name = Constants.STUDENT_TABLE)
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long studentId;

    private String firstName;
    private String lastName;
    private Date dateOfBirth;
    private String gender;
    private String address;
    private String contactNumber;
    private String nationality;

    /**
     * One-to-One relationship with HealthRecord.
     * A student has a single associated health record.
     * Cascade type ALL ensures that operations performed on Student propagated to HealthRecord.
     */
    @OneToOne(mappedBy = Constants.STUDENT_COLUMN, cascade = CascadeType.ALL)
    private HealthRecord healthRecord;

    /**
     * One-to-Many relationship with ParentGuardian.
     * A student can have multiple parents/guardians associated.
     * Cascade type ALL ensures that operations performed on Student propagated to ParentGuardian entities.
     */
    @OneToMany(mappedBy = Constants.STUDENT_COLUMN, cascade = CascadeType.ALL)
    private List<ParentGuardian> parents;

    /**
     * Default constructor.
     */
    public Student() {
    }

    /**
     * Parameterized constructor for initializing Student.
     *
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
    public Student(String firstName, String lastName, Date dateOfBirth, String gender, String address, String contactNumber, String nationality, HealthRecord healthRecord, List<ParentGuardian> parents) {
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
     * @return studentId
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
    public HealthRecord getHealthRecord() {
        return healthRecord;
    }

    /**
     * Sets the associated health record of the student.
     *
     * @param healthRecord Health record to set
     */
    public void setHealthRecord(HealthRecord healthRecord) {
        this.healthRecord = healthRecord;
    }

    /**
     * Gets the list of parents/guardians associated with the student.
     *
     * @return parents
     */
    public List<ParentGuardian> getParents() {
        return parents;
    }

    /**
     * Sets the list of parents/guardians associated with the student.
     *
     * @param parents List of ParentGuardian to set
     */
    public void setParents(List<ParentGuardian> parents) {
        this.parents = parents;
    }
}