package com.qslabs.sms.exception;

import com.qslabs.sms.util.Constants;

public class StudentNotFoundException extends RuntimeException {
    public StudentNotFoundException(String message) {
        super(Constants.STUDENT_NOT_FOUND + message);
    }
    public StudentNotFoundException() {
        super(Constants.STUDENT_NOT_FOUND);
    }
}