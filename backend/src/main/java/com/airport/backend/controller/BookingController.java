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

    // =================================================================================
    // Fetch occupied seats to paint them RED on the visual airplane layout
    // =================================================================================
    @GetMapping("/flights/{flightId}/seats")
    public ResponseEntity<List<String>> getBookedSeats(@PathVariable Long flightId) {
        List<String> bookedSeats = bookingRepository.findBookedSeatsByFlightId(flightId);
        return ResponseEntity.ok(bookedSeats);
    }

@PostMapping("/create")
    @Transactional // Locks the entire method into a single transaction (Overbooking Prevention)
    public ResponseEntity<?> createBooking(@RequestBody BookFlightRequest request) {
        
        // 1. Lock the flight record to prevent race conditions
        Optional<Flight> flightOpt = flightRepository.findByIdLocked(request.getFlight_id());
        if (flightOpt.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: Flight not found.");
        Flight flight = flightOpt.get();

        // 2. Fetch Aircraft capacity
        Optional<Aircraft> aircraftOpt = aircraftRepository.findById(flight.getAircraft_id());
        if (aircraftOpt.isEmpty()) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: Aircraft configuration missing.");
        int maxSeats = aircraftOpt.get().getNumber_of_seats();

        long currentBookings = bookingRepository.countBookingsByFlightId(flight.getFlight_id());
        if (currentBookings >= maxSeats) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Booking Failed: Flight is completely sold out.");

        // 3. Prevent duplicate passengers on the same flight
        long existingUserBookings = bookingRepository.countByFlightAndPassenger(flight.getFlight_id(), request.getPassenger_id());
        if (existingUserBookings > 0) {
            Map<String, String> error = new HashMap<>(); error.put("error", "Booking failed! You already have a ticket for this flight.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        // 4. Proactive Overbooking Prevention (Seat Level)
        List<String> takenSeats = bookingRepository.findBookedSeatsByFlightId(flight.getFlight_id());
        if (takenSeats.contains(request.getSeat_no())) {
            Map<String, String> error = new HashMap<>(); error.put("error", "Booking failed! Seat " + request.getSeat_no() + " was just taken.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        // =====================================================================
        // 5. NEW: SEAT INVENTORY & CLASS CAPACITY ENFORCEMENT
        // =====================================================================
        int rowNumber;
        try {
            // Extract the numbers from the seat string (e.g., "12B" -> 12)
            rowNumber = Integer.parseInt(request.getSeat_no().replaceAll("[^0-9]", ""));
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>(); error.put("error", "Invalid seat format.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        String reqClass = request.getClass_name();
        boolean validSeatForClass = false;
        
        // Enforce the physical limits of the airplane layout!
        if (reqClass.equalsIgnoreCase("First") && (rowNumber >= 1 && rowNumber <= 2)) validSeatForClass = true;
        if (reqClass.equalsIgnoreCase("Business") && (rowNumber >= 3 && rowNumber <= 5)) validSeatForClass = true;
        if (reqClass.equalsIgnoreCase("Economy") && (rowNumber >= 6 && rowNumber <= 15)) validSeatForClass = true;

        if (!validSeatForClass) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Security Violation: Seat " + request.getSeat_no() + " does not belong to the " + reqClass + " cabin.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
        // =====================================================================

        // 6. If all checks pass, save the booking!
        Booking newBooking = new Booking();
        newBooking.setFlight_id(request.getFlight_id());
        newBooking.setPassenger_id(request.getPassenger_id());
        newBooking.setClass_name(request.getClass_name());
        newBooking.setSeat_no(request.getSeat_no());
        newBooking.setIs_transit(request.getIs_transit() != null ? request.getIs_transit() : false);

        bookingRepository.save(newBooking);

        Map<String, Object> successResponse = new HashMap<>();
        successResponse.put("ticket_no", newBooking.getTicket_no()); 
        successResponse.put("message", "Success! Flight Booked. Your seat is: " + request.getSeat_no());
        return ResponseEntity.ok(successResponse);
    }
}