package com.airport.backend.service;

import com.airport.backend.entity.BoardingPass;
import com.airport.backend.entity.Booking;
import com.airport.backend.entity.Flight;
import com.airport.backend.repository.BoardingPassRepository;
import com.airport.backend.repository.BookingRepository;
import com.airport.backend.repository.FlightRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
public class GateService {

    @Autowired private FlightRepository flightRepository;
    @Autowired private BoardingPassRepository boardingPassRepository;
    @Autowired private BookingRepository bookingRepository; 

    // --- FLIGHT STATUS MANAGEMENT ---
    @Transactional
    public void updateFlightStatus(Long flightId, String newStatus) {
        Flight flight = flightRepository.findById(flightId)
                .orElseThrow(() -> new RuntimeException("Flight not found."));

        flight.setStatus(newStatus.toUpperCase());
        flightRepository.save(flight);
    }

    // --- BOARDING PASS SCANNER LOGIC ---
    @Transactional
    public Map<String, Object> scanBoardingPass(Long boardingPassId) {
        
        // 1. Verify the physical pass exists
        BoardingPass pass = boardingPassRepository.findById(boardingPassId)
                .orElseThrow(() -> new RuntimeException("Invalid Boarding Pass ID."));

        // 2. Use the ticket_no on the pass to find the actual Booking details
        Booking booking = bookingRepository.findById(pass.getTicket_no())
                .orElseThrow(() -> new RuntimeException("Booking record not found for this pass."));

        // 3. THE MAGIC OF JPA: The flight is already loaded inside the booking!
        Flight flight = booking.getFlight();
        
        // 4. Gate Verification: Is the flight actually boarding?
        if (!"BOARDING".equalsIgnoreCase(flight.getStatus())) {
            throw new RuntimeException("Boarding Rejected: Flight is currently " + flight.getStatus() + ".");
        }

        // 5. Security Verification: Did they already scan this pass?
        if (pass.getIs_boarded() != null && pass.getIs_boarded()) { 
            throw new RuntimeException("SECURITY ALERT: This boarding pass has already been scanned!");
        }

        // 6. Mark as safely boarded
        pass.setIs_boarded(true);
        boardingPassRepository.save(pass);

        // 7. Return success data to the Gate Agent's screen
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Passenger successfully boarded.");
        response.put("seat", booking.getSeat_no());
        response.put("class", booking.getClass_name());
        
        return response;
    }
}