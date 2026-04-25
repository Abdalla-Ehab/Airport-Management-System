package com.airport.backend.controller;

import com.airport.backend.entity.BoardingPass;
import com.airport.backend.entity.Booking;
import com.airport.backend.repository.BoardingPassRepository;
import com.airport.backend.repository.BookingRepository;
import com.airport.backend.entity.Flight;
import com.airport.backend.repository.FlightRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

@RestController
@RequestMapping("/api/checkin")
public class CheckInController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private BoardingPassRepository boardingPassRepository;

    // Add the Flight Repository so we can grab the gate and time!
    @Autowired
    private FlightRepository flightRepository;

    @PostMapping("/{ticketNo}")
    public ResponseEntity<?> generateBoardingPass(@PathVariable Long ticketNo) {
        
        // 1. Verify the ticket actually exists
        Optional<Booking> bookingOpt = bookingRepository.findById(ticketNo);
        if (bookingOpt.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Check-In Failed: Ticket Number " + ticketNo + " does not exist.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
        Booking booking = bookingOpt.get();

        // 2. Prevent Double Check-In
        Optional<BoardingPass> existingPass = boardingPassRepository.findByTicketNumber(ticketNo);
        if (existingPass.isPresent()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Check-In Failed: A boarding pass has already been issued for Ticket " + ticketNo + "!");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        // 3. Generate the actual Boarding Pass
        BoardingPass boardingPass = new BoardingPass();
        boardingPass.setTicket_no(ticketNo);
        boardingPass.setIssue_time(LocalDateTime.now());
        boardingPass.setSequence_number(new Random().nextInt(150) + 1);
        boardingPassRepository.save(boardingPass);

        // 4. Look up the missing Flight Details!
        Optional<Flight> flightOpt = flightRepository.findById(booking.getFlight_id());

        // 5. Build the rich JSON response
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Success! You are checked in.");
        response.put("ticket_no", ticketNo);
        response.put("flight_id", booking.getFlight_id());
        response.put("seat_no", booking.getSeat_no());
        response.put("class_name", booking.getClass_name());
        response.put("sequence_number", boardingPass.getSequence_number());

        // If the flight exists, attach the gate, airport, and time
        if (flightOpt.isPresent()) {
            Flight f = flightOpt.get();
            response.put("gate", f.getDeparture_gate_id());
            response.put("departure_airport", f.getDeparture_airport_id());
            response.put("departure_time", f.getDeparture_time());
        }

        return ResponseEntity.ok(response);
    }
}