package com.qslabs.sms.exception;

/**
 * Base exception for "not found" errors in the application.
 */
public class NotFoundException extends RuntimeException {
    public NotFoundException(String message) {
        super(message);
    }
}
