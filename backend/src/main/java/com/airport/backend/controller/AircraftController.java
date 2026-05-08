package com.airport.backend.controller;

import com.airport.backend.entity.Aircraft;
import com.airport.backend.service.AircraftService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
@RestController
@RequestMapping("/api/aircraft")
public class AircraftController {

    @Autowired
    private AircraftService aircraftService;

    @GetMapping
    public List<Aircraft> getAllAircraft() {
        return aircraftService.getAllAircraft();
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateAircraftStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String newStatus = payload.get("status");
        
        try {
            Aircraft aircraft = aircraftService.updateStatus(id, newStatus);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Aircraft " + aircraft.getRegistration_no() + " is now " + aircraft.getStatus());
            response.put("new_status", aircraft.getStatus());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }
}