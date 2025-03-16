package com.qslabs.sms.exception;

/**
 * Exception thrown when a custom query fails or returns unexpected results.
 */
public class CustomQueryException extends RuntimeException {
    public CustomQueryException(String message) {
        super(message);
    }
}
