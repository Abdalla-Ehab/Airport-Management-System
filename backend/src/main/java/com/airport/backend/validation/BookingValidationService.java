package com.airport.backend.validation;

import com.airport.backend.entity.Booking;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class BookingValidationService {

    public void validateSeatsAreAvailable(List<String> requestedSeats, List<Booking> existingBookings) {
        Set<String> takenSeats = existingBookings.stream()
                .map(Booking::getSeat_no)
                .collect(Collectors.toSet());

        for (String seat : requestedSeats) {
            if (takenSeats.contains(seat)) {
                throw new RuntimeException("Seat already taken: " + seat);
            }
        }
    }
}