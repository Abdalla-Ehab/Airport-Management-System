package com.airport.backend.service;

import com.airport.backend.dto.BookFlightRequest;
import com.airport.backend.response.BookingResponse;

import java.util.List;

public interface BookingService {
    List<BookingResponse> createBooking(BookFlightRequest request, String username);
    List<BookingResponse> getMyBookings(String username);
}