package com.airport.backend.service;

import com.airport.backend.dto.BookFlightRequest;
import com.airport.backend.response.BookingResponse;

import java.util.List;

public interface BookingService {

    // =====================================
    // CREATE BOOKING
    // =====================================

    List<BookingResponse> createBooking(
            BookFlightRequest request,
            String username
    );

    // =====================================
    // GET USER BOOKINGS
    // =====================================

    List<BookingResponse> getMyBookings(
            String username
    );

    // =====================================
    // CANCEL BOOKING
    // =====================================

    void cancelBooking(
            Long ticketNo,
            String username
    );
}