package com.example.sms_backend.util;

import java.security.PublicKey;

public class Constants {

    // CORS settings
    public static final String FRONTEND_URL = "http://localhost:5173";
    public static final String INSOMNIA_URL = "http://localhost:8080";
    public static final String MAPPING_URL = "/api/**";
    public static final String METHOD_GET = "GET";
    public static final String METHOD_POST = "POST";
    public static final String METHOD_PUT = "PUT";
    public static final String METHOD_DELETE = "DELETE";
    public static final String ALLOWED_HEADERS = "*";

    // Feign client settings
    public static final int FEIGN_CONNECT_TIMEOUT = 5000; // 5 seconds
    public static final int FEIGN_READ_TIMEOUT = 10000;   // 10 seconds

    // Request Mapping Constants
    public static final String REQUEST_MAPPING_HEALTH = "/api/health-records";
    public static final String REQUEST_MAPPING_PARENT = "/api/parents";
    public static final String REQUEST_MAPPING_STUDENT = "/api/students";
    public static final String GET_MAPPING = "/student/{studentId}";
    public static final String PUT_MAPPING = "/{id}";
    public static final String DELETE_MAPPING = "/{id}";
    public static final String GET_MAPPING_STUDENT = "/{id}";
    public static final String PUT_MAPPING_STUDENT = "/{id}";
    public static final String DELETE_MAPPING_STUDENT = "/{id}";
    public static final String GET_MAPPING_ATTENDANCE = "/{id}/details";

    //Common Controller Constants
    public static final String MESSAGE = "message";
    public static final String STUDENT = "student";
    public static final String ATTENDANCERECORDS = "attendanceRecords";
    public static final String ENROLLEDCOURSES = "enrolledCourses";
    public static final String PARENT_GUARDIAN = "parent-guardian";
    public static final String HEALTH_RECORD = "healthRecord";
    public static final String STUDENTS = "students";
    public static final String CURRENT_PAGE = "currentPage";
    public static final String TOTAL_PAGES = "totalPages";
    public static final String TOTAL_STUDENTS = "totalStudents";
    public static final String ZERO = "0";
    public static final String TEN = "10";

    // Health-Record Message Constants
    public static final String HEALTH_RECORD_NOT_FOUND = "Health record for student with ID %d not found.";
    public static final String HEALTH_RECORD_FOUND = "Health record for student with ID %d retrieved successfully.";
    public static final String HEALTH_RECORD_ADDED = "Health record with ID %d has been successfully created.";
    public static final String HEALTH_RECORD_UPDATED = "Health record with ID %d has been successfully updated.";
    public static final String HEALTH_RECORD_DELETED = "Health record with ID %d has been successfully deleted.";

    // Parent-Guardian Messages
    public static final String PARENT_NOT_FOUND = "Parent/Guardian with ID %d not found.";
    public static final String PARENT_NOT_FOUND_FOR_STUDENT = "No parents/guardians found for student with ID %d.";
    public static final String PARENT_FOUND_FOR_STUDENT = "Parents/Guardians found for student with ID %d.";
    public static final String PARENT_ADDED = "Parent/Guardian with ID %d has been successfully added.";
    public static final String PARENT_UPDATED = "Parent/Guardian with ID %d has been successfully updated.";
    public static final String PARENT_DELETED = "Parent/Guardian with ID %d has been successfully deleted.";

    // Student messages
    public static final String STUDENTS_FETCHED = "Students retrieved successfully.";
    public static final String STUDENT_NOT_FOUND = "Student with ID %d not found.";
    public static final String STUDENT_FOUND = "Student with ID %d retrieved successfully.";
    public static final String STUDENT_ADDED = "Student with ID %d has been successfully created.";
    public static final String STUDENT_UPDATED = "Student with ID %d has been successfully updated.";
    public static final String STUDENT_DELETED = "Student with ID %d has been successfully deleted.";
    public static final String STUDENT_DETAILS_FETCHED = "Details for student with ID %d retrieved successfully.";


    // Logging messages
    public static final String REQUEST_RECEIVED = "Received request: {} {}";
    public static final String RESPONSE_SENT = "Response sent with status: {}";
    public static final String ERROR_OCCURRED = "An error occurred: {}";

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

