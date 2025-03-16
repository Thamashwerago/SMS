package com.qslabs.sms.config;

import com.qslabs.sms.util.Constants;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuration class for enabling Cross-Origin Resource Sharing (CORS).
 * This allows frontend applications (e.g., React, Angular) to interact with the backend securely.
 *
 * CORS settings include:
 * - Allowed origins (domains that can access the backend)
 * - Allowed HTTP methods (GET, POST, PUT, DELETE, etc.)
 * - Allowed headers (specific headers permitted in requests)
 */
@Configuration
public class CorsConfig {

    /**
     * Defines a bean that configures CORS settings for the application.
     * This ensures that requests from different origins can be processed correctly.
     *
     * @return WebMvcConfigurer instance with CORS configurations.
     */
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping(Constants.ADD_MAPPING) // Configures URL patterns for CORS.
                        .allowedOrigins(Constants.ALLOWED_ORIGINS) // Defines allowed origins.
                        .allowedMethods(
                                Constants.GET_METHODS,
                                Constants.POST_METHODS,
                                Constants.PUT_METHODS,
                                Constants.DELETE_METHODS
                        ) // Specifies allowed HTTP methods.
                        .allowedHeaders(Constants.ALLOWED_HEADERS); // Specifies allowed headers.
            }
        };
    }
}
