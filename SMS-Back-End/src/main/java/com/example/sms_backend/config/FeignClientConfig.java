package com.example.sms_backend.config;

import com.example.sms_backend.util.Constants;
import feign.Logger;
import feign.Request;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration class for Feign clients.
 * This class defines Feign-specific settings such as logging and timeout configurations.
 */
@Configuration
public class FeignClientConfig {

    /**
     * Configures the Feign client logging level.
     * This setting controls the level of detail in Feign logs.
     *
     * @return Logger.Level - The logging level for Feign.
     */
    @Bean
    public Logger.Level feignLoggerLevel() {
        return Logger.Level.FULL; // Enables detailed request/response logging
    }

    /**
     * Configures Feign client timeout settings.
     * Defines connection and read timeout durations for Feign API calls.
     *
     * @return Request.Options - The configured timeout settings.
     */
    @Bean
    public Request.Options feignRequestOptions() {
        return new Request.Options(
                Constants.FEIGN_CONNECT_TIMEOUT,  // Connection timeout (milliseconds)
                Constants.FEIGN_READ_TIMEOUT     // Read timeout (milliseconds)
        );
    }
}


