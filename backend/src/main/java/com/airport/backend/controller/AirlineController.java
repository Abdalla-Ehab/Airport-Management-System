package com.airport.backend.controller;

import com.airport.backend.entity.Airline;
import com.airport.backend.repository.AirlineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/airlines")
public class AirlineController {
    @Autowired
    private AirlineRepository airlineRepository;

    @GetMapping
    public List<Airline> getAllAirlines() {
        return airlineRepository.findAll();
    }
}