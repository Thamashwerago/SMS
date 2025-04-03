package com.qslabs.sms.config;

import com.qslabs.sms.service.impl.CustomUserDetailsService;
import com.qslabs.sms.util.Constants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Configuration class for Spring Security setup.
 */
@Configuration
@EnableWebSecurity // Enables Spring Security’s web security support
@EnableMethodSecurity(prePostEnabled = true, securedEnabled = true) // Enables method-level security
public class SecurityConfig {

    @Autowired
    private UserDetailsService userDetailsService; // Injects the user detail service to load user-specific data

    /**
     * Bean to provide password encoding mechanism using BCrypt hashing.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Defines the security filter chain configuration for handling authentication and authorization.
     *
     * @param http                     HttpSecurity instance to configure web based security
     * @param customUserDetailsService Custom implementation of UserDetailsService
     * @return Configured SecurityFilterChain
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, CustomUserDetailsService customUserDetailsService) throws Exception {
        http
                .cors(Customizer.withDefaults()) // Enable CORS with default configuration
                .csrf(csrf -> csrf.disable()) // Disable CSRF protection (not recommended for production unless using stateless APIs)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(Constants.ADD_MAPPING).permitAll() // Publicly accessible endpoints
                        .anyRequest().authenticated() // All other requests require authentication
                )
                .userDetailsService(customUserDetailsService) // Set custom user details service
                .httpBasic(Customizer.withDefaults()); // Use HTTP Basic authentication

        return http.build(); // Return the configured security filter chain
    }

    /**
     * Configures CORS settings for the application.
     *
     * @return CorsConfigurationSource with custom allowed origins, methods, headers, etc.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(Constants.ALLOWED_ORIGINS)); // Set allowed origins (e.g., frontend app domain)
        config.setAllowedMethods(List.of(Constants.METHODS)); // Allowed HTTP methods (GET, POST, etc.)
        config.setAllowedHeaders(List.of(Constants.ALLOWED_HEADERS)); // Allowed request headers
        config.setAllowCredentials(true); // Allow credentials like cookies and authorization headers

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration(Constants.ADD_MAPPING_AUTH, config); // Apply the CORS configuration to specific paths
        return source;
    }
}
