package com.qslabs.sms.model;

import com.qslabs.sms.dto.TeacherDTO;
import com.qslabs.sms.util.Constants;
import jakarta.persistence.*;

import java.time.LocalDate;

/**
 * Entity class representing a Teacher.
 * This class maps to the TEACHER_TABLE defined in the database.
 */
@Entity
@Table(name = Constants.TEACHER_TABLE)
public class Teacher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String name;
    private String phone;
    private String dob;
    private String gender;
    private String address;
    private LocalDate joiningDate;
    private String status;
    private String role;

    /**
     * Default constructor required by JPA.
     */
    public Teacher() {}

    /**
     * Constructor to populate Teacher entity from a TeacherDTO.
     *
     * @param teacherDTO the DTO containing teacher data
     */
    public Teacher(TeacherDTO teacherDTO) {
        this.userId = teacherDTO.getUserId();
        this.name = teacherDTO.getName();
        this.phone = teacherDTO.getPhone();
        this.dob = teacherDTO.getDob();
        this.gender = teacherDTO.getGender();
        this.address = teacherDTO.getAddress();
        this.joiningDate = teacherDTO.getJoiningDate();
        this.status = teacherDTO.getStatus();
        this.role = teacherDTO.getRole();
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getDob() {
        return dob;
    }

    public void setDob(String dob) {
        this.dob = dob;
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

    public LocalDate getJoiningDate() {
        return joiningDate;
    }

    public void setJoiningDate(LocalDate joiningDate) {
        this.joiningDate = joiningDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
