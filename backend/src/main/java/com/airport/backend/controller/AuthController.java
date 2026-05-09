package com.airport.backend.controller;

import com.airport.backend.dto.LoginRequest;
import com.airport.backend.dto.PassengerRegisterRequest;
import com.airport.backend.dto.StaffRegisterRequest;
import com.airport.backend.response.ApiResponse;
import com.airport.backend.service.AuthService;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    // SECURITY: Create a bucket allowing 5 requests per minute maximum
    private final Bucket loginBucket;

    public AuthController() {
        Bandwidth limit = Bandwidth.classic(5, Refill.greedy(5, Duration.ofMinutes(1)));
        this.loginBucket = Bucket.builder().addLimit(limit).build();
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Map<String, Object>>> login(@RequestBody LoginRequest request) {
        // SECURITY CHECK: Rate Limiting
        if (!loginBucket.tryConsume(1)) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                .body(ApiResponse.error("Too many login attempts. Please try again in 1 minute."));
        }

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