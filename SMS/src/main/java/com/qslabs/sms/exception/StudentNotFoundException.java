package com.qslabs.sms.exception;

/**
 * Exception thrown when a student record is not found.
 * Inherits from NotFoundException to standardize error handling.
 */
public class StudentNotFoundException extends NotFoundException {
    public StudentNotFoundException(String message) {
        super(message);
    }
}
