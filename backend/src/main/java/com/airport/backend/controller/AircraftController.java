package com.airport.backend.controller;

import com.airport.backend.entity.Aircraft;
import com.airport.backend.repository.AircraftRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/aircraft")
public class AircraftController {

    @Autowired
    private AircraftRepository aircraftRepository;

    // 1. Get the whole fleet
    @GetMapping
    public List<Aircraft> getAllAircraft() {
        return aircraftRepository.findAll();
    }

    // 2. Change Aircraft Status (Grounding Logic)
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateAircraftStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String newStatus = payload.get("status").toUpperCase();
        
        Optional<Aircraft> opt = aircraftRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Aircraft not found"));
        }

        Aircraft aircraft = opt.get();
        aircraft.setStatus(newStatus);
        aircraftRepository.save(aircraft);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Aircraft " + aircraft.getRegistration_no() + " is now " + newStatus);
        response.put("new_status", newStatus);
        return ResponseEntity.ok(response);
    }
}