package com.qslabs.sms.util;

/**
 * Utility class containing application-wide constants.
 * These constants are used across different modules such as CORS configuration,
 * controllers (health records, parent guardians, students), exception handling, and database tables.
 */
public class Constants {

    /* ============================ */
    /*         CorsConfig           */
    /* ============================ */
    /**
     * URL mapping for CORS configuration.
     */
    public static final String ADD_MAPPING = "/api/**";

    /**
     * Allowed origins for CORS requests.
     */
    public static final String ALLOWED_ORIGINS = "*";

    /**
     * Allowed GET HTTP method.
     */
    public static final String GET_METHODS = "GET";

    /**
     * Allowed POST HTTP method.
     */
    public static final String POST_METHODS = "POST";

    /**
     * Allowed PUT HTTP method.
     */
    public static final String PUT_METHODS = "PUT";

    /**
     * Allowed DELETE HTTP method.
     */
    public static final String DELETE_METHODS = "DELETE";

    /**
     * Allowed headers for CORS requests.
     */
    public static final String ALLOWED_HEADERS = "*";

    /* ============================ */
    /*  Health Record Controller    */
    /* ============================ */
    /**
     * Base request mapping for health records.
     */
    public static final String REQUEST_MAPPING_HEALTH = "/api/health-records";

    /**
     * GET mapping to retrieve a student's health record.
     */
    public static final String GET_MAPPING_HEALTH = "/student/{studentId}";

    /**
     * PUT mapping for updating a health record.
     */
    public static final String PUT_MAPPING_HEALTH = "/{id}";

    /**
     * DELETE mapping for deleting a health record.
     */
    public static final String DELETE_MAPPING_HEALTH = "/{id}";

    /* ============================ */
    /* Parent Guardian Controller   */
    /* ============================ */
    /**
     * Base request mapping for parent/guardian records.
     */
    public static final String REQUEST_MAPPING_PARENT = "/api/parents";

    /**
     * GET mapping to retrieve parent/guardian details by student ID.
     */
    public static final String GET_MAPPING_PARENT = "/student/{studentId}";

    /**
     * PUT mapping for updating a parent/guardian record.
     */
    public static final String PUT_MAPPING_PARENT = "/{id}";

    /**
     * DELETE mapping for deleting a parent/guardian record.
     */
    public static final String DELETE_MAPPING_PARENT = "/{id}";

    /* ============================ */
    /*      Student Controller      */
    /* ============================ */
    /**
     * Base request mapping for student records.
     */
    public static final String REQUEST_MAPPING_STUDENT = "/api/students";

    /**
     * GET mapping to retrieve a student by ID.
     */
    public static final String GET_MAPPING_STUDENT = "/{id}";

    /**
     * PUT mapping for updating a student record.
     */
    public static final String PUT_MAPPING_STUDENT = "/{id}";

    /**
     * DELETE mapping for deleting a student record.
     */
    public static final String DELETE_MAPPING_STUDENT = "/{id}";

    /* ============================ */
    /*         Exception            */
    /* ============================ */
    /**
     * Key for timestamp in error responses.
     */
    public static final String TIMESTAMP = "timestamp";

    /**
     * Key for HTTP status code in error responses.
     */
    public static final String STATUS = "status";

    /**
     * Key for error description in error responses.
     */
    public static final String ERROR = "error";

    /**
     * Key for error message in error responses.
     */
    public static final String MESSAGE = "message";

    /**
     * Default error message when a student record is not found.
     */
    public static final String STUDENT_NOT_FOUND = "Student Not Found";

    /**
     * Default error message for internal server errors.
     */
    public static final String INTERNAL_SERVER_ERROR = "Internal Server Error";

    /**
     * Default error message for custom query errors.
     */
    public static final String CUSTOM_QUERY_ERROR = "Custom Query Error";

    /* ============================ */
    /*    Tables and Essentials     */
    /* ============================ */
    /**
     * Name of the health records table in the database.
     */
    public static final String HEALTH_TABLE = "health_records";

    /**
     * Name of the parent/guardian table in the database.
     */
    public static final String PARENT_TABLE = "parents_guardians";

    /**
     * Name of the students table in the database.
     */
    public static final String STUDENT_TABLE = "students";

    /**
     * Column name for the student ID in related tables.
     */
    public static final String STUDENT_ID_COLUMN = "studentId";

    /**
     * Column name for the student reference.
     */
    public static final String STUDENT_COLUMN = "student";
}

