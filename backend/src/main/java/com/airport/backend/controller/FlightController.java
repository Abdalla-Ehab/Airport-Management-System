package com.airport.backend.controller;

import com.airport.backend.dto.FlightRequest;
import com.airport.backend.response.FlightResponse;
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
    public List<FlightResponse> getAllFlights() {
        return flightService.getAllFlights();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<?> scheduleFlight(@RequestBody FlightRequest request) {
        try {
            FlightResponse savedFlight = flightService.scheduleFlight(request);
            return ResponseEntity.ok(savedFlight); 
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}