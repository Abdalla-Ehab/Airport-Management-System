package com.airport.backend.controller;

import com.airport.backend.entity.BoardingPass;
import com.airport.backend.entity.Booking;
import com.airport.backend.repository.BoardingPassRepository;
import com.airport.backend.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@RestController
@RequestMapping("/api/checkin")
public class CheckInController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private BoardingPassRepository boardingPassRepository;

    @PostMapping("/{ticketNo}")
    public ResponseEntity<?> generateBoardingPass(@PathVariable Long ticketNo) {
        
        // 1. Verify the ticket actually exists in the Booking table
        Optional<Booking> bookingOpt = bookingRepository.findById(ticketNo);
        if (bookingOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Check-In Failed: Ticket Number " + ticketNo + " does not exist.");
        }
        Booking booking = bookingOpt.get();

        // 2. Prevent Double Check-In!
        Optional<BoardingPass> existingPass = boardingPassRepository.findByTicketNumber(ticketNo);
        if (existingPass.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Check-In Failed: A boarding pass has already been issued for Ticket " + ticketNo + "!");
        }

        // 3. Generate the actual Boarding Pass
        BoardingPass boardingPass = new BoardingPass();
        boardingPass.setTicket_no(ticketNo);
        boardingPass.setIssue_time(LocalDateTime.now());
        
        // Assign a random boarding sequence number (e.g., "You are the 42nd person to check in")
        boardingPass.setSequence_number(new Random().nextInt(150) + 1);

        // 4. Save it to the database
        boardingPassRepository.save(boardingPass);

        // 5. Return the digital boarding pass to the user's screen
        return ResponseEntity.ok("Success! You are checked in.\n" +
                "Flight: " + booking.getFlight_id() + "\n" +
                "Seat: " + booking.getSeat_no() + "\n" +
                "Boarding Sequence: " + boardingPass.getSequence_number());
    }
}