package com.qslabs.sms.exception;

import com.qslabs.sms.util.Constants;

public class TimetableNotFoundException extends RuntimeException {
    public TimetableNotFoundException(String message) {
        super(Constants.TIMETABLE_NOT_FOUND + message);
    }
    public TimetableNotFoundException() {
        super(Constants.TIMETABLE_NOT_FOUND);
    }
}