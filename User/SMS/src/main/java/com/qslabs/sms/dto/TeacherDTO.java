package com.qslabs.sms.dto;

import com.qslabs.sms.model.Teacher;

public class TeacherDTO {
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

        public TeacherDTO() {}

        public TeacherDTO(String name, String email, String password, String phone, String dob, String gender, String address, String joiningDate, String status, String role) {
            this.name = name;
            this.email = email;
            this.password = password;
            this.phone = phone;
            this.dob = dob;
            this.gender = gender;
            this.address = address;
            this.joiningDate = joiningDate;
            this.status = status;
            this.role = role;
        }

        public TeacherDTO(Teacher teacher) {
            this.id = teacher.getId();
            this.name = teacher.getName();
            this.email = teacher.getEmail();
            this.password = teacher.getPassword();
            this.phone = teacher.getPhone();
            this.dob = teacher.getDob();
            this.gender = teacher.getGender();
            this.address = teacher.getAddress();
            this.joiningDate = teacher.getJoiningDate();
            this.status = teacher.getStatus();
            this.role = teacher.getRole();
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

    public String getJoiningDate() {
        return joiningDate;
    }

    public void setJoiningDate(String joiningDate) {
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
