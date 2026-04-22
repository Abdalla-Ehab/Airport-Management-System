package com.airport.backend.controller;

import com.airport.backend.dto.BookFlightRequest;
import com.airport.backend.entity.Booking;
import com.airport.backend.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Random;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    // 1. Get all bookings for a specific passenger
    @GetMapping("/passenger/{passengerId}")
    public List<Booking> getPassengerBookings(@PathVariable Long passengerId) {
        // Warning: For this to work perfectly, you might need to add a custom method in BookingRepository later,
        // but for now, we will return all bookings to test the endpoint.
        return bookingRepository.findAll(); 
    }

    // 2. Create a NEW Booking!
    @PostMapping("/create")
    public ResponseEntity<?> createBooking(@RequestBody BookFlightRequest request) {
        
        Booking newBooking = new Booking();
        newBooking.setFlight_id(request.getFlight_id());
        newBooking.setPassenger_id(request.getPassenger_id());
        newBooking.setClass_name(request.getClass_name());
        newBooking.setIs_transit(false);
        
        // Randomly assign a seat like "12A" for now
        String[] columns = {"A", "B", "C", "D", "E", "F"};
        String randomSeat = (new Random().nextInt(30) + 1) + columns[new Random().nextInt(6)];
        newBooking.setSeat_no(randomSeat);

        // Save it to the database!
        bookingRepository.save(newBooking);

        return ResponseEntity.ok("Success! Flight Booked. Your seat is: " + randomSeat);
    }
}