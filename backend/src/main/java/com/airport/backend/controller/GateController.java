package com.airport.backend.controller;

import com.airport.backend.service.GateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/gate")
public class GateController {

    @Autowired
    private GateService gateService;

    // Only Gate Staff or Admins can change a flight's status to "BOARDING" or "DEPARTED"
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    @PutMapping("/flights/{flightId}/status")
    public ResponseEntity<?> changeFlightStatus(@PathVariable Long flightId, @RequestParam String status) {
        try {
            gateService.updateFlightStatus(flightId, status);
            return ResponseEntity.ok(Map.of("message", "Flight status successfully updated to " + status));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    // Only Gate Staff or Admins can scan passes
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    @PostMapping("/scan/{boardingPassId}")
    public ResponseEntity<?> scanPassengerPass(@PathVariable Long boardingPassId) {
        try {
            Map<String, Object> result = gateService.scanBoardingPass(boardingPassId);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            // If the service throws a Security Alert or "Not Boarding" error, it safely returns a 400!
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }
}