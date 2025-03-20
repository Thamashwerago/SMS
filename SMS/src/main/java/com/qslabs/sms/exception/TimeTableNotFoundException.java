package com.qslabs.sms.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class TimeTableNotFoundException extends ResponseStatusException {

    public TimeTableNotFoundException(Long id) {
        super(HttpStatus.NOT_FOUND, "TimeTable entry with ID " + id + " not found.");
    }

    public TimeTableNotFoundException(String message) {
        super(HttpStatus.NOT_FOUND, message);
    }
}
