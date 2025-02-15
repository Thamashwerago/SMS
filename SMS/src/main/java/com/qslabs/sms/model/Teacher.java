package com.qslabs.sms.model;

import com.qslabs.sms.dto.TeacherDTO;
import jakarta.persistence.*;

@Entity
@Table(name = "Teachers")
public class Teacher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String password;
    private String phone;
    private String dob;
    private String gender;
    private String address;
    private String joiningDate;
    private String status;
    private String role;

    public Teacher() {}

    public Teacher(TeacherDTO teacherDTO) {
        this.name = teacherDTO.getName();
        this.email = teacherDTO.getEmail();
        this.password = teacherDTO.getPassword();
        this.phone = teacherDTO.getPhone();
        this.dob = teacherDTO.getDob();
        this.gender = teacherDTO.getGender();
        this.address = teacherDTO.getAddress();
        this.joiningDate = teacherDTO.getJoiningDate();
        this.status = teacherDTO.getStatus();
        this.role = teacherDTO.getRole();
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
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

    public String getJoiningDate() {
        return joiningDate;
    }

    public void setJoiningDate(String joiningDate) {
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
