package com.airport.backend.controller;

import com.airport.backend.entity.Flight;
import com.airport.backend.repository.FlightRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/flights")
public class FlightController {
    @Autowired
    private FlightRepository flightRepository;

    @GetMapping
    public List<Flight> getAllFlights() {
        return flightRepository.findAll();
    }
}