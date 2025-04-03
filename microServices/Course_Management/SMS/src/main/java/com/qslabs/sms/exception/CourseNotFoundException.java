package com.qslabs.sms.exception;

import com.qslabs.sms.util.Constants;

public class CourseNotFoundException extends RuntimeException {
    public CourseNotFoundException(String message) {
        super(Constants.COURSE_NOT_FOUND + message);
    }
    public CourseNotFoundException() {
        super(Constants.COURSE_NOT_FOUND);
    }
}