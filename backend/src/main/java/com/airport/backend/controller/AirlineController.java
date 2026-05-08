package com.airport.backend.controller;

import com.airport.backend.entity.Airline;
import com.airport.backend.repository.AirlineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/airlines")
public class AirlineController {
    
    @Autowired
    private AirlineRepository airlineRepository;

    // 1. PUBLIC: Anyone can see the list of airlines
    @GetMapping
    public List<Airline> getAllAirlines() {
        return airlineRepository.findAll();
    }

    // 2. ADMIN ONLY: Future-proofing for adding new airlines
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Airline> addAirline(@RequestBody Airline airline) {
        return ResponseEntity.ok(airlineRepository.save(airline));
    }
}