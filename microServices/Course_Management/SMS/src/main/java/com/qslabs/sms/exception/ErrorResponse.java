package com.qslabs.sms.exception;

import java.time.LocalDateTime;

public class ErrorResponse {
    private String message;
    private String path;
    private LocalDateTime timestamp;

    public ErrorResponse(String message, String path) {
        this.message = message;
        this.path = path;
        this.timestamp = LocalDateTime.now();
    }

    // Getters and setters
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getPath() { return path; }
    public void setPath(String path) { this.path = path; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
