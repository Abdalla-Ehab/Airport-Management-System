package com.airport.backend.controller;

import com.airport.backend.dto.LoginRequest;
import com.airport.backend.dto.PassengerRegisterRequest;
import com.airport.backend.dto.StaffRegisterRequest;
import com.airport.backend.response.ApiResponse;
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
    public ResponseEntity<ApiResponse<Map<String, Object>>> login(@RequestBody LoginRequest request) {
        try {
            Map<String, Object> tokenData = authService.authenticateUser(request);
            return ResponseEntity.ok(ApiResponse.success("Login successful", tokenData));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/register/passenger")
    public ResponseEntity<ApiResponse<Void>> registerPassenger(@RequestBody PassengerRegisterRequest request) {
        try {
            authService.registerPassenger(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Passenger registered successfully", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.error(e.getMessage()));
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/register/staff")
    public ResponseEntity<ApiResponse<Void>> registerStaff(@RequestBody StaffRegisterRequest request) {
        try {
            authService.registerStaff(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Staff member registered successfully", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.error(e.getMessage()));
        }
    }
}