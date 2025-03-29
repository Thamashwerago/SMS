package com.qslabs.sms.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// TODO Add comments
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/attendance/**")
                        .allowedOrigins("*") // Update frontend URLs
                        .allowedMethods("GET", "POST", "PUT", "DELETE");
                //.allowedHeaders("*");// Allow credentials for authentication
                //.allowCredentials(true);
            }
        };
    }
}
