package com.airport.backend.controller;

import com.airport.backend.entity.Airport;
import com.airport.backend.repository.AirportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity; // Added for future-proofing
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*; // Changed to .* to include @PostMapping

import java.util.List;

@RestController
@RequestMapping("/api/airports")
public class AirportController {

    @Autowired
    private AirportRepository airportRepository;

    // 1. PUBLIC: Anyone (even people not logged in) can see the list of airports
    @GetMapping
    public List<Airport> getAllAirports() {
        return airportRepository.findAll();
    }

    // 2. ADMIN ONLY: Use this if you ever add a "Add Airport" button in the future
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Airport> addAirport(@RequestBody Airport airport) {
        return ResponseEntity.ok(airportRepository.save(airport));
    }

    // 3. ADMIN ONLY: Update Airport
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Airport> updateAirport(@PathVariable Long id, @RequestBody Airport airportDetails) {
        return airportRepository.findById(id).map(airport -> {
            airport.setName(airportDetails.getName());
            airport.setCity(airportDetails.getCity());
            airport.setCountry(airportDetails.getCountry());
            airport.setIata_code(airportDetails.getIata_code());
            return ResponseEntity.ok(airportRepository.save(airport));
        }).orElse(ResponseEntity.notFound().build());
    }

    // 4. ADMIN ONLY: Delete Airport
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAirport(@PathVariable Long id) {
        return airportRepository.findById(id).map(airport -> {
            airportRepository.delete(airport);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}