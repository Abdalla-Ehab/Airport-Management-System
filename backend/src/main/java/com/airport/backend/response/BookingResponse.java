package com.airport.backend.response;

public record BookingResponse(

    Long bookingId,

    Long flightId,

    String seatNo,

    String className,

    // =====================================
    // NEW BOARDING PASS FIELDS
    // =====================================

    String passengerName,

    String departureAirport,

    String arrivalAirport,

    String departureTime,

    String arrivalTime,

    String flightDate,

    String flightNumber

) {}