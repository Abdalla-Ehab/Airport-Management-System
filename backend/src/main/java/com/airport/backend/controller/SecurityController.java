package com.airport.backend.controller;

import com.airport.backend.entity.SecurityLog;
import com.airport.backend.repository.SecurityLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize; // 1. Added Import
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

// 2. THIS LOCKS THE ENTIRE CLASS!
@PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
@RestController
@RequestMapping("/api/security")
public class SecurityController {
    
    @Autowired
    private SecurityLogRepository securityLogRepository;

    // ==========================================
    // 1. VIEW LOGS
    // ==========================================
    @GetMapping
    public List<SecurityLog> getAllSecurityLogs() {
        return securityLogRepository.findAll();
    }

    // ==========================================
    // 2. SUBMIT NEW INCIDENT REPORT
    // ==========================================
    @PostMapping
    public ResponseEntity<?> fileIncidentReport(@RequestBody SecurityLog log) {
        try {
            SecurityLog savedLog = securityLogRepository.save(log);
            return ResponseEntity.ok(Map.of("message", "Incident report filed successfully.", "log", savedLog));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to file report."));
        }
    }
}