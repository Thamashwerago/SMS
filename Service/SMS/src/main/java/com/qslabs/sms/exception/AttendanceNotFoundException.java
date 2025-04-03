package com.qslabs.sms.exception;

import com.qslabs.sms.util.Constants;

public class AttendanceNotFoundException extends RuntimeException {
    public AttendanceNotFoundException(String message) {
        super(Constants.ATTENDANCE_NOT_FOUND + message);
    }
    public AttendanceNotFoundException() {
        super(Constants.ATTENDANCE_NOT_FOUND);
    }
}
