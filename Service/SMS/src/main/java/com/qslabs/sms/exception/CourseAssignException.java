package com.qslabs.sms.exception;

import com.qslabs.sms.util.Constants;

public class CourseAssignException extends RuntimeException {
    public CourseAssignException(String message) {
        super(Constants.COURSE_ASSIGN_NOT_FOUND + message);
    }
    public CourseAssignException() {
        super(Constants.COURSE_ASSIGN_NOT_FOUND);
    }
}
