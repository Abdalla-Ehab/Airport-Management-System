package com.airport.backend.service;

import com.airport.backend.dto.FlightRequest;
import com.airport.backend.response.FlightResponse;
import java.util.List;

public interface FlightService {
    List<FlightResponse> getAllFlights();
    FlightResponse getFlightById(Long id);
    FlightResponse scheduleFlight(FlightRequest request); 
    List<FlightResponse> findFlights(
    Long origin,
    Long destination,
    String date
);
}