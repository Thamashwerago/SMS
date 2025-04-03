package com.qslabs.sms.model;

import com.qslabs.sms.util.Constants;
import jakarta.persistence.*;

import java.time.LocalDate;
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

    private Long userId;
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private String gender;
    private String address;
    private String contactNumber;
    private String nationality;

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
     */
    public Student(Long userId,String firstName, String lastName, LocalDate dateOfBirth, String gender, String address, String contactNumber, String nationality) {
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.dateOfBirth = dateOfBirth;
        this.gender = gender;
        this.address = address;
        this.contactNumber = contactNumber;
        this.nationality = nationality;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
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
    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    /**
     * Sets the date of birth of the student.
     *
     * @param dateOfBirth Date of birth to set
     */
    public void setDateOfBirth(LocalDate dateOfBirth) {
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
}