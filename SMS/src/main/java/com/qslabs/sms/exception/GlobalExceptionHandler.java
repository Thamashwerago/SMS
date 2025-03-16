package com.qslabs.sms.exception;

import com.qslabs.sms.util.Constants;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Global exception handler for the SMS application.
 * Provides standardized error responses for various exception types.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handles exceptions for any resource not found errors.
     * This now catches all exceptions inheriting from NotFoundException.
     *
     * @param ex the thrown-NotFoundException or its subclass
     * @return ResponseEntity with NOT_FOUND status and error details
     */
    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFoundException(NotFoundException ex) {
        Map<String, Object> response = new HashMap<>();
        response.put(Constants.TIMESTAMP, LocalDateTime.now());
        response.put(Constants.STATUS, HttpStatus.NOT_FOUND.value());
        // Using a constant for an error message can be generalized if needed
        response.put(Constants.ERROR, Constants.STUDENT_NOT_FOUND);
        response.put(Constants.MESSAGE, ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    /**
     * Handles exceptions resulting from errors in custom queries.
     *
     * @param ex the thrown CustomQueryException
     * @return ResponseEntity with BAD_REQUEST status and error details
     */
    @ExceptionHandler(CustomQueryException.class)
    public ResponseEntity<Map<String, Object>> handleCustomQueryException(CustomQueryException ex) {
        Map<String, Object> response = new HashMap<>();
        response.put(Constants.TIMESTAMP, LocalDateTime.now());
        response.put(Constants.STATUS, HttpStatus.BAD_REQUEST.value());
        response.put(Constants.ERROR, Constants.CUSTOM_QUERY_ERROR);
        response.put(Constants.MESSAGE, ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    /**
     * Handles all generic exceptions that are not explicitly handled by other methods.
     *
     * @param ex the thrown Exception
     * @return ResponseEntity with INTERNAL_SERVER_ERROR status and error details
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(Exception ex) {
        Map<String, Object> response = new HashMap<>();
        response.put(Constants.TIMESTAMP, LocalDateTime.now());
        response.put(Constants.STATUS, HttpStatus.INTERNAL_SERVER_ERROR.value());
        response.put(Constants.ERROR, Constants.INTERNAL_SERVER_ERROR);
        response.put(Constants.MESSAGE, ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}
