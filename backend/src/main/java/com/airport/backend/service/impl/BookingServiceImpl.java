package com.airport.backend.service.impl;

import com.airport.backend.dto.BookFlightRequest;
import com.airport.backend.entity.Booking;
import com.airport.backend.entity.Flight;
import com.airport.backend.entity.Passenger;
import com.airport.backend.mapper.BookingMapper;
import com.airport.backend.repository.BookingRepository;
import com.airport.backend.repository.FlightRepository;
import com.airport.backend.repository.PassengerRepository;
import com.airport.backend.response.BookingResponse;
import com.airport.backend.service.BookingService;
import com.airport.backend.validation.BookingValidationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingServiceImpl implements BookingService {

        @Autowired
        private BookingRepository bookingRepository;
        @Autowired
        private FlightRepository flightRepository;
        @Autowired
        private PassengerRepository passengerRepository;
        @Autowired
        private BookingValidationService validationService;
        @Autowired
        private BookingMapper bookingMapper;

        @Override
        @Transactional
        public List<BookingResponse> createBooking(BookFlightRequest request, String username) {

                // 1. Fetch Entities
                Passenger passenger = passengerRepository.findByUsername(username)
                                .orElseThrow(() -> new RuntimeException("Passenger not found"));

                Flight flight = flightRepository.findById(request.getFlight_id())
                                .orElseThrow(() -> new RuntimeException("Flight not found"));

                // 2. Fetch Existing Bookings using our new custom query
                List<Booking> existingBookings = bookingRepository.findByFlightId(flight.getFlight_id());

                // 3. Delegate to Validation Layer
                validationService.validateSeatsAreAvailable(request.getSeat_nos(), existingBookings);

                // 4. Process Business Logic
                List<Booking> newBookings = new ArrayList<>();
                for (String seat : request.getSeat_nos()) {
                        Booking booking = new Booking();
                        booking.setFlight(flight); // <--- Now passing the entire Flight object!
                        booking.setPassenger(passenger); // <--- Now passing the entire Passenger object!
                        booking.setSeat_no(seat);
                        booking.setClass_name(request.getClass_name());

                        newBookings.add(booking);
                }

                // 5. Persistence
                bookingRepository.saveAll(newBookings);

                // 6. Delegate to Mapper Layer
                return newBookings.stream()
                                .map(bookingMapper::toResponse)
                                .collect(Collectors.toList());
        }

        @Override
        public List<BookingResponse> getMyBookings(String username) {
                Passenger passenger = passengerRepository.findByUsername(username)
                                .orElseThrow(() -> new RuntimeException("Passenger not found"));

                // Using our new custom query here too!
                return bookingRepository.findByPassengerId(passenger.getPassengerId()).stream()
                                .map(bookingMapper::toResponse)
                                .collect(Collectors.toList());
        }
}