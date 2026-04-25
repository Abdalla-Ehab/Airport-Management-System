package com.airport.backend.controller;

import com.airport.backend.dto.BookFlightRequest;
import com.airport.backend.entity.Aircraft;
import com.airport.backend.entity.Booking;
import com.airport.backend.entity.Flight;
import com.airport.backend.repository.AircraftRepository;
import com.airport.backend.repository.BookingRepository;
import com.airport.backend.repository.FlightRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;
import java.util.Optional;
import org.springframework.dao.DataIntegrityViolationException;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private AircraftRepository aircraftRepository;

    @GetMapping("/passenger/{passengerId}")
    public List<Booking> getPassengerBookings(@PathVariable Long passengerId) {
        return bookingRepository.findAll(); 
    }

    @PostMapping("/create")
    @Transactional // 1. THIS IS THE FIX: Locks the entire method into a single transaction
    public ResponseEntity<?> createBooking(@RequestBody BookFlightRequest request) {
        
        // 2. THIS IS THE FIX: Use the locked query to prevent simultaneous double-booking
        Optional<Flight> flightOpt = flightRepository.findByIdLocked(request.getFlight_id());
        
        if (flightOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: Flight not found.");
        }
        Flight flight = flightOpt.get();

        // 2. Find the Aircraft assigned to this flight to check its capacity
        Optional<Aircraft> aircraftOpt = aircraftRepository.findById(flight.getAircraft_id());
        if (aircraftOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: Aircraft configuration missing for this flight.");
        }
        Aircraft aircraft = aircraftOpt.get();
        int maxSeats = aircraft.getNumber_of_seats();

        // 3. Count how many tickets are already sold
        long currentBookings = bookingRepository.countBookingsByFlightId(flight.getFlight_id());

        // 4. THE BUSINESS LOGIC: Prevent Overbooking!
        if (currentBookings >= maxSeats) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Booking Failed: Flight " + flight.getFlight_id() + " is completely sold out! (Capacity: " + maxSeats + ")");
        }

        // 5. If there is space, process the booking
        Booking newBooking = new Booking();
        newBooking.setFlight_id(request.getFlight_id());
        newBooking.setPassenger_id(request.getPassenger_id());
        newBooking.setClass_name(request.getClass_name());
        newBooking.setIs_transit(false);

        // 6. Assign a smart, sequential seat instead of a random one
        long seatNumber = currentBookings + 1; // If 45 people are booked, you are person 46
        String[] letters = {"A", "B", "C", "D", "E", "F"};
        String seatLabel = (seatNumber / 6 + 1) + letters[(int)(seatNumber % 6)];
        newBooking.setSeat_no(seatLabel);

        // 7. Try to save safely
        try {
            bookingRepository.save(newBooking);

            // Return a JSON Map so the frontend can read the ticket number properly!
            Map<String, Object> successResponse = new HashMap<>();
            successResponse.put("ticket_no", newBooking.getTicket_no()); 
            successResponse.put("message", "Success! Flight Booked. Your seat is: " + seatLabel + 
                    " (Flight capacity: " + (currentBookings + 1) + "/" + maxSeats + " seats filled)");
            
            return ResponseEntity.ok(successResponse);

        } catch (DataIntegrityViolationException e) {
            // Catches the MySQL duplicate constraints without crashing the server
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Booking failed! You are already booked on this flight, or this specific seat is taken.");
            
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
}