package com.example.devworkspace.configuration;

import org.jspecify.annotations.NonNull;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(@NonNull CorsRegistry registry) {
                registry.addMapping("/**")
                        // Allow specific origins only (update with your production domain)
                        .allowedOrigins("http://localhost:3000", "http://localhost:8080")
                        // Only allow necessary HTTP methods
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        // Restrict headers to essentials
                        .allowedHeaders("Content-Type", "Authorization", "X-Requested-With")
                        // Allow credentials to be sent
                        .allowCredentials(true)
                        // Cache CORS preflight for 1 hour
                        .maxAge(3600);
            }
        };
    }
}