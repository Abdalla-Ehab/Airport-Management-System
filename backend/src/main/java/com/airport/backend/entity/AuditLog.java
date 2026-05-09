package com.airport.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_log")
public class AuditLog {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String username;
    private String action; // e.g., "LOGIN_SUCCESS", "BAGGAGE_SCAN"
    private String details; // e.g., "Scanned bag BG-123 at Gate F4"
    private LocalDateTime timestamp = LocalDateTime.now();

    // Getters and Setters...
    public AuditLog(String username, String action, String details) {
        this.username = username;
        this.action = action;
        this.details = details;
    }
    public AuditLog() {}
}