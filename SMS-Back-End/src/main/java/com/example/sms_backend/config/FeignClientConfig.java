package com.example.sms_backend.config;

import feign.Logger;
import feign.Request;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FeignClientConfig {

    // Configure Feign logging level
    @Bean
    public Logger.Level feignLoggerLevel() {
        return Logger.Level.FULL; // Enables detailed request/response logging
    }

    // Configure Feign timeout settings
    @Bean
    public Request.Options feignRequestOptions() {
        return new Request.Options(5000, 10000); // 5s connect timeout, 10s read timeout
    }
}

