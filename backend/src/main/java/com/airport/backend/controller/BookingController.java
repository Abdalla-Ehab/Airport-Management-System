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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired private FlightRepository flightRepository;
    @Autowired private BookingRepository bookingRepository;
    @Autowired private AircraftRepository aircraftRepository;

    // =====================================================================
    // 1. Fetch Occupied Seats for the Frontend Interactive Map
    // =====================================================================
    @GetMapping("/flights/{flightId}/seats")
    public ResponseEntity<List<String>> getOccupiedSeats(@PathVariable Long flightId) {
        List<String> takenSeats = bookingRepository.findBookedSeatsByFlightId(flightId);
        return ResponseEntity.ok(takenSeats);
    }

    // =====================================================================
    // 2. Multi-Passenger Booking Engine
    // =====================================================================
    @PostMapping("/create")
    @Transactional // Locks the entire method to prevent overbooking race conditions
    public ResponseEntity<?> createBooking(@RequestBody BookFlightRequest request) {

        // Ensure they actually selected seats
        if (request.getSeat_nos() == null || request.getSeat_nos().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "No seats were selected."));
        }

        // 1. Lock the flight record to prevent race conditions
        Optional<Flight> flightOpt = flightRepository.findByIdLocked(request.getFlight_id());
        if (flightOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Flight not found."));
        }
        Flight flight = flightOpt.get();

        // 2. Fetch Aircraft capacity
        Optional<Aircraft> aircraftOpt = aircraftRepository.findById(flight.getAircraft_id());
        if (aircraftOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Aircraft configuration missing."));
        }
        int maxSeats = aircraftOpt.get().getNumber_of_seats();

        long currentBookings = bookingRepository.countBookingsByFlightId(flight.getFlight_id());
        
        // 3. Multi-Passenger Inventory Check (Are there enough seats left for the WHOLE group?)
        if (currentBookings + request.getSeat_nos().size() > maxSeats) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Booking Failed: Not enough seats left on this flight for your group."));
        }

        List<String> takenSeats = bookingRepository.findBookedSeatsByFlightId(flight.getFlight_id());
        String reqClass = request.getClass_name();

        // 4. Proactive Security Validation for EVERY requested seat in the array
        for (String seat : request.getSeat_nos()) {
            if (takenSeats.contains(seat)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Booking failed! Seat " + seat + " was just taken by someone else."));
            }

            int rowNumber;
            try {
                // Extract the numbers from the seat string (e.g., "12B" -> 12)
                rowNumber = Integer.parseInt(seat.replaceAll("[^0-9]", ""));
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Invalid seat format: " + seat));
            }

            // Enforce class boundaries
            boolean validSeatForClass = false;
            if (reqClass.equalsIgnoreCase("First") && (rowNumber >= 1 && rowNumber <= 2)) validSeatForClass = true;
            if (reqClass.equalsIgnoreCase("Business") && (rowNumber >= 3 && rowNumber <= 5)) validSeatForClass = true;
            if (reqClass.equalsIgnoreCase("Economy") && (rowNumber >= 6 && rowNumber <= 15)) validSeatForClass = true;

            if (!validSeatForClass) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", 
                    "Security Violation: Seat " + seat + " does not belong to the " + reqClass + " cabin."));
            }
        }

        // 5. If ALL checks pass, loop through and save ALL bookings!
        List<Long> generatedTickets = new ArrayList<>();
        for (String seat : request.getSeat_nos()) {
            Booking newBooking = new Booking();
            newBooking.setFlight_id(request.getFlight_id());
            newBooking.setPassenger_id(request.getPassenger_id());
            newBooking.setClass_name(request.getClass_name());
            newBooking.setSeat_no(seat);
            newBooking.setIs_transit(request.getIs_transit() != null ? request.getIs_transit() : false);

            bookingRepository.save(newBooking);
            generatedTickets.add(newBooking.getTicket_no());
        }

        // 6. Return the success response with the list of new tickets
        Map<String, Object> successResponse = new HashMap<>();
        successResponse.put("ticket_nos", generatedTickets); 
        successResponse.put("ticket_no", generatedTickets.get(0)); // Provided for backward UI compatibility
        successResponse.put("message", "Success! Booked " + generatedTickets.size() + " tickets. Seats: " + String.join(", ", request.getSeat_nos()));
        
        return ResponseEntity.ok(successResponse);
    }
}