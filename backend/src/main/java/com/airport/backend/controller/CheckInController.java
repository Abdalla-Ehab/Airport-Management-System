package com.airport.backend.controller;

import com.airport.backend.entity.BoardingPass;
import com.airport.backend.entity.Booking;
import com.airport.backend.entity.Passenger;
import com.airport.backend.repository.BoardingPassRepository;
import com.airport.backend.repository.BookingRepository;
import com.airport.backend.entity.Flight;
import com.airport.backend.repository.FlightRepository;
import com.airport.backend.repository.PassengerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

@RestController
@RequestMapping("/api/checkin")
public class CheckInController {

    @Autowired private BookingRepository bookingRepository;
    @Autowired private BoardingPassRepository boardingPassRepository;
    @Autowired private FlightRepository flightRepository;
    
    // 1. Inject PassengerRepository to look up the real user
    @Autowired private PassengerRepository passengerRepository;

    // Lock the endpoint to Passengers
    @PreAuthorize("hasRole('PASSENGER')")
    @PostMapping("/{ticketNo}")
    public ResponseEntity<?> generateBoardingPass(@PathVariable Long ticketNo) {
        
        // --- IDOR PROTECTION: Extract real identity from the JWT Token ---
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String loggedInUsername = auth.getName();

        Optional<Passenger> loggedInUserOpt = passengerRepository.findByUsername(loggedInUsername);
        if (loggedInUserOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid access token."));
        }
        
        Long realPassengerId = loggedInUserOpt.get().getPassengerId();
        // -----------------------------------------------------------------

        // 1. Verify the ticket actually exists
        Optional<Booking> bookingOpt = bookingRepository.findById(ticketNo);
        if (bookingOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Check-In Failed: Ticket Number " + ticketNo + " does not exist."));
        }
        Booking booking = bookingOpt.get();

        // 2. CRITICAL SECURITY CHECK: Does this passenger actually own this ticket?
        if (!booking.getPassenger_id().equals(realPassengerId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Security Violation: You do not have permission to check in this ticket."));
        }

        // 3. Prevent Double Check-In
        Optional<BoardingPass> existingPass = boardingPassRepository.findByTicketNumber(ticketNo);
        if (existingPass.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Check-In Failed: A boarding pass has already been issued for Ticket " + ticketNo + "!"));
        }

        // 4. Generate the actual Boarding Pass
        BoardingPass boardingPass = new BoardingPass();
        boardingPass.setTicket_no(ticketNo);
        boardingPass.setIssue_time(LocalDateTime.now());
        boardingPass.setSequence_number(new Random().nextInt(150) + 1);
        boardingPassRepository.save(boardingPass);

        // 5. Look up the missing Flight Details
        Optional<Flight> flightOpt = flightRepository.findById(booking.getFlight_id());

        // 6. Build the rich JSON response
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Success! You are checked in.");
        response.put("ticket_no", ticketNo);
        response.put("flight_id", booking.getFlight_id());
        response.put("seat_no", booking.getSeat_no());
        response.put("class_name", booking.getClass_name());
        response.put("sequence_number", boardingPass.getSequence_number());

        if (flightOpt.isPresent()) {
            Flight f = flightOpt.get();
            response.put("gate", f.getDeparture_gate_id());
            response.put("departure_airport", f.getDeparture_airport_id());
            response.put("departure_time", f.getDeparture_time());
        }

        return ResponseEntity.ok(response);
    }
}