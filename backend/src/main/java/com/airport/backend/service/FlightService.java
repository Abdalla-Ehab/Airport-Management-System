package com.airport.backend.service;

import com.airport.backend.dto.FlightRequest;
import com.airport.backend.entity.Flight;

import java.util.List;
import java.util.Optional;

public interface FlightService {
    List<Flight> getAllFlights();
    Optional<Flight> getFlightById(Long id);
    Flight scheduleFlight(FlightRequest request); // Replaces the unsafe saveFlight!
    List<Flight> findFlights(String origin, String destination);
}