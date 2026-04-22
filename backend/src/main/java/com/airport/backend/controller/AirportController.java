package com.airport.backend.controller;

import com.airport.backend.entity.Airport;
import com.airport.backend.repository.AirportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/airports")
public class AirportController {

    @Autowired
    private AirportRepository airportRepository;

    @GetMapping
    public List<Airport> getAllAirports() {
        return airportRepository.findAll();
    }
}