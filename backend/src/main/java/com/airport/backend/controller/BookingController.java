package com.airport.backend.controller;

import com.airport.backend.dto.BookFlightRequest;
import com.airport.backend.response.BookingResponse;
import com.airport.backend.service.BookingService;
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

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookFlightRequest request, Authentication authentication) {
        try {
            List<BookingResponse> tickets = bookingService.createBooking(request, authentication.getName());
            return ResponseEntity.ok(Map.of(
                    "message", "Booking successful",
                    "tickets", tickets
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyBookings(Authentication authentication) {
        try {
            List<BookingResponse> tickets = bookingService.getMyBookings(authentication.getName());
            return ResponseEntity.ok(tickets);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}