package com.example.sms_backend.util;

public class Constants {

    // Error messages
    public static final String STUDENT_NOT_FOUND = "Student with ID %d not found.";
    public static final String HEALTH_RECORD_NOT_FOUND = "Health record not found";
    public static final String PARENT_NOT_FOUND = "Parent/Guardian not found";
    public static final String COURSE_NOT_FOUND = "Course information not found";
    public static final String ATTENDANCE_NOT_FOUND = "Attendance records not found";

    // Logging messages
    public static final String REQUEST_RECEIVED = "Received request: {} {}";
    public static final String RESPONSE_SENT = "Response sent with status: {}";
    public static final String ERROR_OCCURRED = "An error occurred: {}";

    // CORS settings
    public static final String FRONTEND_URL = "http://localhost:5173";

    // Feign client settings
    public static final int FEIGN_CONNECT_TIMEOUT = 5000; // 5 seconds
    public static final int FEIGN_READ_TIMEOUT = 10000;   // 10 seconds

    // Success messages
    public static final String STUDENT_FOUND = "Student retrieved successfully";
    public static final String STUDENT_CREATED = "Student created successfully";
    public static final String STUDENT_UPDATED = "Student updated successfully";
    public static final String STUDENT_DELETED = "Student deleted successfully";
    public static final String HEALTH_RECORD_UPDATED = "Health record updated successfully";
    public static final String PARENT_ADDED = "Parent/Guardian added successfully";

    // Validation messages
    public static final String INVALID_PHONE = "Invalid phone number format";
    public static final String EMPTY_FIELD = "Field cannot be empty";
    public static final String INVALID_EMAIL = "Invalid email format.";
    public static final String INVALID_DATE_FORMAT = "Invalid date format. Expected: yyyy-MM-dd";
    public static final String INVALID_NAME = "Name should contain only letters and spaces";

    // External Service URLs
    public static final String ATTENDANCE_SERVICE_URL = "http://localhost:8082/api/attendance";
    public static final String COURSE_SERVICE_URL = "http://localhost:8083/api/courses";

    //
}

