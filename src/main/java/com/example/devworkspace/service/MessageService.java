package com.example.devworkspace.service;

import com.example.devworkspace.entity.Message;
import com.example.devworkspace.repository.MessageRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageService {

    private final MessageRepository repository;

    public MessageService(MessageRepository repository) {
        this.repository = repository;
    }

    public Message createMessage(Message message) {
        return repository.save(message);
    }

    public List<Message> getAllMessages() {
        return repository.findAll();
    }
}