package com.airport.backend.service.impl;

import com.airport.backend.dto.FlightRequest;
import com.airport.backend.entity.Flight;
import com.airport.backend.repository.FlightRepository;
import com.airport.backend.service.FlightService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service 
public class FlightServiceImpl implements FlightService {

    @Autowired
    private FlightRepository flightRepository;

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
        
        // Validation Layer: Time Travel Check
        if (dto.getDeparture_time().isAfter(dto.getArrival_time())) {
            throw new RuntimeException("Scheduling Error: Departure time must be before arrival time!");
        }

        // Manual Mapping: The Firewall
        Flight newFlight = new Flight();
        newFlight.setFlight_number(dto.getFlight_number());
        newFlight.setAircraft_id(dto.getAircraft_id());
        newFlight.setAirline_id(dto.getAirline_id());
        newFlight.setDeparture_airport_id(dto.getDeparture_airport_id());
        newFlight.setArrival_airport_id(dto.getArrival_airport_id());
        newFlight.setDeparture_time(dto.getDeparture_time());
        newFlight.setArrival_time(dto.getArrival_time());
        
        // System-controlled status
        newFlight.setStatus("SCHEDULED"); 

        return flightRepository.save(newFlight);
    }

    @Override
    public List<Flight> findFlights(String origin, String destination) {
        // You can leave this as-is for now, or update it later if you want to search by airport IDs
        return flightRepository.findAll(); 
    }
}