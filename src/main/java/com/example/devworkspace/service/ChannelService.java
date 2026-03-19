package com.example.devworkspace.service;

import com.example.devworkspace.entity.Channel;
import com.example.devworkspace.repository.ChannelRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChannelService {

    private final ChannelRepository repository;

    public ChannelService(ChannelRepository repository) {
        this.repository = repository;
    }

    public Channel createChannel(Channel channel) {
        return repository.save(channel);
    }

    public List<Channel> getAllChannels() {
        return repository.findAll();
    }
}