package com.example.devworkspace.controller;

import com.example.devworkspace.entity.Channel;
import com.example.devworkspace.service.ChannelService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/channels")
public class ChannelController {

    private final ChannelService service;

    public ChannelController(ChannelService service) {
        this.service = service;
    }

    @PostMapping
    public Channel createChannel(@RequestBody Channel channel) {
        return service.createChannel(channel);
    }

    @GetMapping
    public List<Channel> getAllChannels() {
        return service.getAllChannels();
    }
}