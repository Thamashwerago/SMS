package com.qslabs.sms.dto;

import com.qslabs.sms.model.Teacher;

public class TeacherDTO {
        private Long id;
        private String name;
        private String email;

        public TeacherDTO() {}

        public TeacherDTO(String name, String email) {
            this.name = name;
            this.email = email;
        }

        public TeacherDTO(Teacher teacher) {
            this.id = teacher.getId();
            this.name = teacher.getName();
            this.email = teacher.getEmail();
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
}
