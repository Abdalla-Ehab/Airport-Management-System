package com.airport.backend.controller;

import com.airport.backend.entity.Flight;
import com.airport.backend.repository.FlightRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/flights")
public class FlightController {
    
    @Autowired
    private FlightRepository flightRepository;

    // ==========================================
    // 1. PUBLIC: Anyone can view the flight board
    // ==========================================
    @GetMapping
    public List<Flight> getAllFlights() {
        return flightRepository.findAll();
    }

    // ==========================================
    // 2. LOCKED: Only Admins can schedule flights
    // ==========================================
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<?> scheduleFlight(@RequestBody Flight flight) {
        try {
            Flight savedFlight = flightRepository.save(flight);
            // Return a JSON message that matches what your frontend expects
            return ResponseEntity.ok(savedFlight); 
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to schedule flight: " + e.getMessage());
        }
    }
}