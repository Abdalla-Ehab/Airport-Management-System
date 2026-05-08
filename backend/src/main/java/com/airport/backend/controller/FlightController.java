package com.airport.backend.controller;

import com.airport.backend.entity.Flight;
import com.airport.backend.service.FlightService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/flights")
public class FlightController {
    
    @Autowired
    private FlightService flightService;

    @GetMapping
    public List<Flight> getAllFlights() {
        return flightService.getAllFlights();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<?> scheduleFlight(@RequestBody Flight flight) {
        try {
            Flight savedFlight = flightService.saveFlight(flight);
            return ResponseEntity.ok(savedFlight); 
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to schedule flight: " + e.getMessage());
        }
    }
}