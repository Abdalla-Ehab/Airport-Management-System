package com.airport.backend.response;

import java.time.LocalDateTime;

public record CheckInResponse(
    String message,
    Long ticket_no,
    Long flight_id,
    String seat_no,
    String class_name,
    Integer sequence_number,
    Long gate,
    Long departure_airport,
    LocalDateTime departure_time
) {}