package com.airport.backend.controller;

import com.airport.backend.dto.LoginRequest;
import com.airport.backend.entity.Passenger;
import com.airport.backend.entity.Staff;
import com.airport.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Map<String, Object> tokenData = authService.authenticateUser(request);
            return ResponseEntity.ok(tokenData);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/register/passenger")
    public ResponseEntity<?> registerPassenger(@RequestBody Passenger passenger) {
        try {
            authService.registerPassenger(passenger);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Passenger registered successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    // Only Admins can register new Staff members
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/register/staff")
    public ResponseEntity<?> registerStaff(@RequestBody Staff staff) {
        try {
            authService.registerStaff(staff);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Staff member registered successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }
}