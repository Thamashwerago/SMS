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
    public static final String ADD_MAPPING_AUTH = "/api/**";

    public static final String ADD_MAPPING = "/api/user/**";

    /**
     * Allowed origins for CORS requests.
     */
    public static final String[] ALLOWED_ORIGINS = {"http://localhost:5173","http://172.236.144.75:5432"};

    /**
     * Allowed HTTP method.
     */
    public static final String[] METHODS = {"GET", "POST", "PUT", "DELETE"};

    /**
     * Allowed headers for CORS requests.
     */
    public static final String ALLOWED_HEADERS = "*";

    /* ============================ */
    /*      Student                 */
    /* ============================ */
    /**
     * Base request mapping for student records.
     */
    public static final String REQUEST_MAPPING_STUDENT = "/api/students";

    /**
     * Name of the students table in the database.
     */
    public static final String STUDENT_TABLE = "students";

    /* ============================ */
    /*      Attendance              */
    /* ============================ */
    /**
     * Base request mapping for attendance records.
     */
    public static final String REQUEST_MAPPING_ATTENDANCE = "/api/attendance";

    /**
     * Name of the attendance table in the database.
     */
    public static final String ATTENDANCE_TABLE = "attendances";

    /* ============================ */
    /*      Course                  */
    /* ============================ */
    /**
     * Base request mapping for course records.
     */
    public static final String REQUEST_MAPPING_COURSE = "/api/courses";

    /**
     * Name of the course table in the database.
     */
    public static final String COURSE_TABLE = "courses";

    /* ============================ */
    /*      Course Assign           */
    /* ============================ */
    /**
     * Base request mapping for course assign records.
     */
    public static final String REQUEST_MAPPING_COURSEASSIGN = "/api/courseassign";

    /**
     * Name of the course assign table in the database.
     */
    public static final String COURSEASSIGN_TABLE = "course_assigns";

    /* ============================ */
    /*      teacher                 */
    /* ============================ */
    /**
     * Base request mapping for teacher records.
     */
    public static final String REQUEST_MAPPING_TEACHER = "/api/teachers";

    /**
     * Name of the teacher table in the database.
     */
    public static final String TEACHER_TABLE = "teachers";

    /* ============================ */
    /*     Time Table               */
    /* ============================ */
    /**
     * Base request mapping for timetable  records.
     */
    public static final String REQUEST_MAPPING_TIMETABLE = "/api/timetable";

    /**
     * Name of the timetable table in the database.
     */
    public static final String TIMETABLE_TABLE = "timetables";

    /* ============================ */
    /*     user                     */
    /* ============================ */
    /**
     * Base request mapping for user  records.
     */
    public static final String REQUEST_MAPPING_USER = "/api/users";

    /**
     * Name of the user table in the database.
     */
    public static final String USER_TABLE = "users";

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

    public static final String ATTENDANCE_NOT_FOUND = "Attendance Not Found";

    public static final String COURSE_NOT_FOUND = "Course Not Found";

    public static final String COURSE_ASSIGN_NOT_FOUND = "Course Assignment Not Found";

    public static final String TEACHER_NOT_FOUND = "Teacher Not Found";

    public static final String TIMETABLE_NOT_FOUND = "TimeTable Not Found";

    public static final String USER_NOT_FOUND = "User Not Found";

    /**
     * Default error message for internal server errors.
     */
    public static final String INTERNAL_SERVER_ERROR = "Internal Server Error";

    /**
     * Default error message for custom query errors.
     */
    public static final String CUSTOM_QUERY_ERROR = "Custom Query Error";
}

