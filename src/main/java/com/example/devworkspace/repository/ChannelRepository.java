package com.example.devworkspace.repository;

import com.example.devworkspace.entity.Channel;
import com.example.devworkspace.entity.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChannelRepository extends JpaRepository<Channel, Long> {
    List<Channel> findByWorkspaceId(Long workspaceId);
}