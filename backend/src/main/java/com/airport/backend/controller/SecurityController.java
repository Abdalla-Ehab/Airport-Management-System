package com.airport.backend.controller;

import com.airport.backend.entity.SecurityLog;
import com.airport.backend.repository.SecurityLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/security")
public class SecurityController {
    @Autowired
    private SecurityLogRepository securityLogRepository;

    @GetMapping
    public List<SecurityLog> getAllSecurityLogs() {
        return securityLogRepository.findAll();
    }
}