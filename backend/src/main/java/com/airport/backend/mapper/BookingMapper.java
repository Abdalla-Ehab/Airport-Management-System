package com.airport.backend.mapper;

import com.airport.backend.entity.Booking;
import com.airport.backend.response.BookingResponse;
import org.springframework.stereotype.Component;

@Component
public class BookingMapper {

    public BookingResponse toResponse(Booking booking) {
        return new BookingResponse(
            booking.getTicket_no(),    // Fixed: Uses ticket_no instead of booking_id
            booking.getFlight_id(),    // Fixed: Pulls the ID directly
            booking.getSeat_no(),
            booking.getClass_name()
        );
    }
}