package com.airport.backend.service.impl;

import com.airport.backend.dto.FlightRequest;
import com.airport.backend.entity.*;
import com.airport.backend.repository.*;
import com.airport.backend.service.FlightService;
import com.airport.backend.exception.custom.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service 
public class FlightServiceImpl implements FlightService {

    @Autowired private FlightRepository flightRepository;
    @Autowired private AirportRepository airportRepository;
    // @Autowired private GateRepository gateRepository;
    @Autowired private AircraftRepository aircraftRepository; // Ensure this exists
    @Autowired private AirlineRepository airlineRepository;   // Ensure this exists

    @Override
    public List<Flight> getAllFlights() {
        return flightRepository.findAll();
    }

    @Override
    public Optional<Flight> getFlightById(Long id) {
        return flightRepository.findById(id);
    }

    @Override
    @Transactional
    public Flight scheduleFlight(FlightRequest dto) {
        
        if (dto.getDeparture_time().isAfter(dto.getArrival_time())) {
            throw new RuntimeException("Scheduling Error: Departure time must be before arrival time!");
        }

        // 1. Look up the real objects based on the IDs in the DTO
        Airport depAirport = airportRepository.findById(dto.getDeparture_airport_id())
            .orElseThrow(() -> new ResourceNotFoundException("Departure Airport not found"));
            
        Airport arrAirport = airportRepository.findById(dto.getArrival_airport_id())
            .orElseThrow(() -> new ResourceNotFoundException("Arrival Airport not found"));

        Aircraft aircraft = aircraftRepository.findById(dto.getAircraft_id())
            .orElseThrow(() -> new ResourceNotFoundException("Aircraft not found"));

        Airline airline = airlineRepository.findById(dto.getAirline_id())
            .orElseThrow(() -> new ResourceNotFoundException("Airline not found"));

        // 2. Map to Entity using objects
        Flight newFlight = new Flight();
        newFlight.setFlight_number(dto.getFlight_number());
        newFlight.setDeparture_time(dto.getDeparture_time());
        newFlight.setArrival_time(dto.getArrival_time());
        newFlight.setStatus("SCHEDULED"); 

        // Set the relationships
        newFlight.setDepartureAirport(depAirport);
        newFlight.setArrivalAirport(arrAirport);
        newFlight.setAircraft(aircraft);
        newFlight.setAirline(airline);

        return flightRepository.save(newFlight);
    }

    @Override
    public List<Flight> findFlights(String origin, String destination) {
        return flightRepository.findAll(); 
    }
}