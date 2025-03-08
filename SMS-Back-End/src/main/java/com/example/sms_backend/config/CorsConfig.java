package com.example.sms_backend.config;

import com.example.sms_backend.util.Constants;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * CORS (Cross-Origin Resource Sharing) configuration class.
 * This configuration allows the backend to handle requests from different origins,
 * such as the frontend application and API testing tools like Insomnia.
 */
@Configuration
public class CorsConfig {

    /**
     * Defines the global CORS settings for the application.
     *
     * @return WebMvcConfigurer with configured CORS policies.
     */
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {

            /**
             * Configures CORS mappings for the API.
             *
             * @param registry The CORS registry where rules are defined.
             */
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping(Constants.MAPPING_URL) // Apply CORS to all API endpoints
                        .allowedOrigins(Constants.FRONTEND_URL, Constants.INSOMNIA_URL) // Allow React frontend & Insomnia
                        .allowedMethods(Constants.METHOD_GET, Constants.METHOD_POST, Constants.METHOD_PUT, Constants.METHOD_DELETE) // HTTP methods
                        .allowedHeaders(Constants.ALLOWED_HEADERS); // Allow all headers
            }
        };
    }
}

