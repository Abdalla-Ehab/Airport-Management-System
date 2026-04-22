package com.airport.backend.controller;

import com.airport.backend.dto.LoginRequest;
import com.airport.backend.entity.Passenger;
import com.airport.backend.entity.Staff;
import com.airport.backend.repository.PassengerRepository;
import com.airport.backend.repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private PassengerRepository passengerRepository;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        
        // 1. Check if the user is a Staff member
        Optional<Staff> staffOpt = staffRepository.findByUsername(loginRequest.getUsername());
        if (staffOpt.isPresent()) {
            Staff staff = staffOpt.get();
            // Check password (In a production app, use BCrypt hashing here instead of plain text!)
            if (staff.getPassword().equals(loginRequest.getPassword())) {
                return ResponseEntity.ok("Login Successful! Welcome Staff Member. Role: " + staff.getRole());
            }
        }

        // 2. If not staff, check if the user is a Passenger
        Optional<Passenger> passengerOpt = passengerRepository.findByUsername(loginRequest.getUsername());
        if (passengerOpt.isPresent()) {
            Passenger passenger = passengerOpt.get();
            if (passenger.getPassword().equals(loginRequest.getPassword())) {
                return ResponseEntity.ok("Login Successful! Welcome Passenger: " + passenger.getFirst_name());
            }
        }

        // 3. If neither matched, return an Unauthorized error
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Error: Invalid username or password!");
    }
}