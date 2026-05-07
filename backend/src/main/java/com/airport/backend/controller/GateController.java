package com.airport.backend.controller;

import com.airport.backend.entity.BoardingPass;
import com.airport.backend.entity.Booking;
import com.airport.backend.entity.Flight;
import com.airport.backend.repository.BoardingPassRepository;
import com.airport.backend.repository.BookingRepository;
import com.airport.backend.repository.FlightRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/gate")
public class GateController {

    @Autowired private FlightRepository flightRepository;
    @Autowired private BookingRepository bookingRepository;
    @Autowired private BoardingPassRepository boardingPassRepository;

    // =====================================================================
    // 1. FLIGHT LIFECYCLE MANAGEMENT (Staff/Admin)
    // =====================================================================
    @PutMapping("/flights/{flightId}/status")
    @Transactional
    public ResponseEntity<?> updateFlightStatus(@PathVariable Long flightId, @RequestParam String status) {
        Optional<Flight> flightOpt = flightRepository.findById(flightId);
        if (flightOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Flight not found.");
        }
        
        Flight flight = flightOpt.get();
        flight.setStatus(status.toUpperCase());
        flightRepository.save(flight);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Flight " + flightId + " is now " + status.toUpperCase());
        return ResponseEntity.ok(response);
    }

    // =====================================================================
    // 2. BOARDING SCANNER & CUTOFF VALIDATION
    // =====================================================================
    @PostMapping("/scan/{boardingPassId}")
    @Transactional
    public ResponseEntity<?> scanBoardingPass(@PathVariable Long boardingPassId) {
        
        // 1. Find the pass
        Optional<BoardingPass> passOpt = boardingPassRepository.findById(boardingPassId);
        if (passOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Invalid Boarding Pass.");
        }
        BoardingPass pass = passOpt.get();

        // 2. Prevent Double Scanning
        if (pass.getIs_boarded()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Passenger has already boarded.");
        }

        // 3. Link the pass to the Booking, then to the Flight
        Optional<Booking> bookingOpt = bookingRepository.findById(pass.getTicket_no());
        if (bookingOpt.isEmpty()) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Booking link missing.");
        
        Optional<Flight> flightOpt = flightRepository.findById(bookingOpt.get().getFlight_id());
        if (flightOpt.isEmpty()) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Flight link missing.");
        
        Flight flight = flightOpt.get();

        // 4. THE VALIDATION LOGIC (Gate Closure & Lifecycle checks)
        String currentStatus = flight.getStatus();
        
        if (currentStatus.equals("SCHEDULED")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Boarding Denied: Flight has not started boarding yet.");
        }
        if (currentStatus.equals("GATE_CLOSED") || currentStatus.equals("DEPARTED")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Boarding Denied: The gate is closed.");
        }
        if (currentStatus.equals("CANCELLED") || currentStatus.equals("DIVERTED")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Boarding Denied: Flight operations suspended.");
        }

        // 5. Success! Mark as boarded
        pass.setIs_boarded(true);
        boardingPassRepository.save(pass);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Success: Passenger cleared for boarding. " + pass.getBoarding_group());
        response.put("seat", bookingOpt.get().getSeat_no());
        return ResponseEntity.ok(response);
    }
}