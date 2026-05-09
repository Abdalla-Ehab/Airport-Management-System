package com.airport.backend.response;

public record BookingResponse(
    Long bookingId,
    Long flightId,
    String seatNo,
    String className
) {}