package com.example.sms_backend.util;

import java.util.regex.Pattern;

public class ValidationUtil {

    // Regex patterns for validation
    private static final String PHONE_PATTERN = "^[0-9]{10}$"; // 10-digit number
    private static final String EMAIL_PATTERN = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";

    // Validate phone number format
    public static boolean isValidPhoneNumber(String phoneNumber) {
        return phoneNumber != null && Pattern.matches(PHONE_PATTERN, phoneNumber);
    }

    // Validate email format
    public static boolean isValidEmail(String email) {
        return email != null && Pattern.matches(EMAIL_PATTERN, email);
    }

    // Validate if a field is empty
    public static boolean isNotEmpty(String field) {
        return field == null || field.trim().isEmpty();
    }
}
