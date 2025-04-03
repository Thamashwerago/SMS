package com.qslabs.sms.dto;

import com.qslabs.sms.model.Teacher;

import java.time.LocalDate;

/**
 * Data Transfer Object for the Teacher entity.
 * Used to carry teacher-related data between layers without exposing the full model.
 */
public class TeacherDTO {
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
     * Default constructor required for deserialization and framework use.
     */
        public TeacherDTO() {}

    /**
     * Parameterized constructor for manually creating DTOs.
     */
        public TeacherDTO(Long userId,String name, String phone, String dob, String gender, String address, LocalDate joiningDate, String status, String role) {
            this.userId = userId;
            this.name = name;
            this.phone = phone;
            this.dob = dob;
            this.gender = gender;
            this.address = address;
            this.joiningDate = joiningDate;
            this.status = status;
            this.role = role;
        }

    /**
     * Converts a Teacher entity into a TeacherDTO.
     *
     * @param teacher the Teacher entity
     */
        public TeacherDTO(Teacher teacher) {
            this.id = teacher.getId();
            this.userId = teacher.getUserId();
            this.name = teacher.getName();
            this.phone = teacher.getPhone();
            this.dob = teacher.getDob();
            this.gender = teacher.getGender();
            this.address = teacher.getAddress();
            this.joiningDate = teacher.getJoiningDate();
            this.status = teacher.getStatus();
            this.role = teacher.getRole();
        }

        //Getter and Setter
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

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getJoiningDate() {
        return joiningDate;
    }

    public void setJoiningDate(LocalDate joiningDate) {
        this.joiningDate = joiningDate;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getDob() {
        return dob;
    }

    public void setDob(String dob) {
        this.dob = dob;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}
