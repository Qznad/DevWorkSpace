package com.example.devworkspace.controller;

import com.example.devworkspace.entity.Message;
import com.example.devworkspace.service.MessageService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/messages")
public class MessageController {

    private final MessageService service;

    public MessageController(MessageService service) {
        this.service = service;
    }

    @PostMapping
    public Message createMessage(@RequestBody Message message) {
        return service.createMessage(message);
    }

    @GetMapping
    public List<Message> getAllMessages() {
        return service.getAllMessages();
    }
}