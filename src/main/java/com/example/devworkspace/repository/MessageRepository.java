package com.example.devworkspace.repository;

import com.example.devworkspace.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepository extends JpaRepository<Message, Long> {
}