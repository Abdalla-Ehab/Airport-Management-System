package com.airport.backend.service.impl;

import com.airport.backend.entity.BoardingPass;
import com.airport.backend.entity.Booking;
import com.airport.backend.entity.Flight;
import com.airport.backend.entity.Passenger;
import com.airport.backend.exception.custom.BusinessValidationException;
import com.airport.backend.exception.custom.ResourceNotFoundException;
import com.airport.backend.repository.BoardingPassRepository;
import com.airport.backend.repository.BookingRepository;
import com.airport.backend.repository.PassengerRepository;
import com.airport.backend.response.CheckInResponse;
import com.airport.backend.service.CheckInService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class CheckInServiceImpl implements CheckInService {

    @Autowired private BookingRepository bookingRepository;
    @Autowired private BoardingPassRepository boardingPassRepository;
    @Autowired private PassengerRepository passengerRepository;

    @Override
    @Transactional
    public CheckInResponse generateBoardingPass(Long ticketNo, String username) {
        
        Passenger loggedInUser = passengerRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Invalid access token."));

        Booking booking = bookingRepository.findById(ticketNo)
                .orElseThrow(() -> new ResourceNotFoundException("Check-In Failed: Ticket Number " + ticketNo + " does not exist."));

        // SECURITY CHECK: IDOR Protection
        if (!booking.getPassenger().getPassengerId().equals(loggedInUser.getPassengerId())) {
            throw new RuntimeException("Security Violation: You do not have permission to check in this ticket.");
        }

        if (boardingPassRepository.findByTicketNumber(ticketNo).isPresent()) {
            throw new BusinessValidationException("Check-In Failed: A boarding pass has already been issued for Ticket " + ticketNo + "!");
        }

        // Generate Boarding Pass
        BoardingPass boardingPass = new BoardingPass();
        boardingPass.setBooking(booking);
        boardingPass.setIssue_time(LocalDateTime.now());
        boardingPass.setSequence_number(new Random().nextInt(150) + 1);
        boardingPassRepository.save(boardingPass);

        // --- THE MAGIC OF JPA ---
        Flight f = booking.getFlight();

        return new CheckInResponse(
                "Success! You are checked in.",
                ticketNo,
                f.getFlight_id(),
                booking.getSeat_no(),
                booking.getClass_name(),
                boardingPass.getSequence_number(),
                // REACHING THROUGH THE OBJECTS:
                f.getDepartureGate() != null ? f.getDepartureGate().getGate_id() : null,
                f.getDepartureAirport() != null ? f.getDepartureAirport().getAirport_id() : null,
                f.getDeparture_time()
        );
    }
}