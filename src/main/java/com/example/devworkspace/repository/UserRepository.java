package com.example.devworkspace.repository;

import com.example.devworkspace.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}