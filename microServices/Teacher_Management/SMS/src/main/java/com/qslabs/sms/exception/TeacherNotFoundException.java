package com.qslabs.sms.exception;

import com.qslabs.sms.util.Constants;

public class TeacherNotFoundException extends RuntimeException {
    public TeacherNotFoundException(String message) {
        super(Constants.TEACHER_NOT_FOUND + message);
    }
    public TeacherNotFoundException() {
        super(Constants.TEACHER_NOT_FOUND);
    }
}