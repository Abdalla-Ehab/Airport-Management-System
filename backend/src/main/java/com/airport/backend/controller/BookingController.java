package com.airport.backend.controller;

import com.airport.backend.dto.BookFlightRequest;
import com.airport.backend.repository.BookingRepository;
import com.airport.backend.response.BookingResponse;
import com.airport.backend.service.BookingService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private BookingRepository bookingRepository;

    // =====================================================
    // CREATE BOOKING
    // =====================================================

    @PostMapping
    public ResponseEntity<?> createBooking(
            @Valid @RequestBody BookFlightRequest request,
            Authentication authentication) {

        List<BookingResponse> tickets =
                bookingService.createBooking(
                        request,
                        authentication.getName()
                );

        return ResponseEntity.ok(
                Map.of(
                        "message", "Booking successful",
                        "tickets", tickets
                )
        );
    }

    // =====================================================
    // GET MY BOOKINGS
    // =====================================================

    @GetMapping("/my")
    public ResponseEntity<?> getMyBookings(
            Authentication authentication) {

        List<BookingResponse> tickets =
                bookingService.getMyBookings(
                        authentication.getName()
                );

        return ResponseEntity.ok(
                tickets
        );
    }

    // =====================================================
    // GET BOOKED SEATS FOR FLIGHT
    // =====================================================

    @GetMapping("/flight/{flightId}/seats")
    public ResponseEntity<?> getBookedSeats(
            @PathVariable Long flightId) {

        List<String> bookedSeats =
                bookingRepository.findBookedSeatsByFlightId(
                        flightId
                );

        return ResponseEntity.ok(
                bookedSeats
        );
    }
}