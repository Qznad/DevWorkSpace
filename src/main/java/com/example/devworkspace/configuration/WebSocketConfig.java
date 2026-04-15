package com.example.devworkspace.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Use "/topic" for broadcasting and "/queue" for private messages
        config.enableSimpleBroker("/topic");
        config.setApplicationDestinationPrefixes("/app"); // if you use @MessageMapping
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // This is the WebSocket endpoint clients connect to
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")  // allow cross-origin
                .withSockJS();                  // fallback for non-WebSocket clients
    }
}