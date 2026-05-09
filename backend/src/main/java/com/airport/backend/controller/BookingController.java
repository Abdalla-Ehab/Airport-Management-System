package com.airport.backend.controller;

import com.airport.backend.dto.BookFlightRequest;
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

    @PostMapping
    public ResponseEntity<?> createBooking(@Valid @RequestBody BookFlightRequest request, Authentication authentication) {
        // The @Valid annotation triggers the GlobalExceptionHandler if the data is bad!
        List<BookingResponse> tickets = bookingService.createBooking(request, authentication.getName());
        
        return ResponseEntity.ok(Map.of(
                "message", "Booking successful",
                "tickets", tickets
        ));
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyBookings(Authentication authentication) {
        // If the service throws a RuntimeException, the GlobalExceptionHandler catches it!
        List<BookingResponse> tickets = bookingService.getMyBookings(authentication.getName());
        
        return ResponseEntity.ok(tickets);
    }
}