package com.example.devworkspace.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())  // Disable CSRF for REST API
            .authorizeHttpRequests(authz -> authz
                // Allow public access to auth endpoints
                .requestMatchers("/api/auth/**").permitAll()
                // Allow WebSocket connections
                .requestMatchers("/ws/**").permitAll()
                // Allow health checks
                .requestMatchers("/health").permitAll()
                // All other endpoints require authentication
                .anyRequest().permitAll()  // For now, allow all for development
            )
            .httpBasic(basic -> basic.disable())  // Disable HTTP Basic auth since we're using custom auth
            .formLogin(form -> form.disable());  // Disable form login since we're using REST

        return http.build();
    }
}
