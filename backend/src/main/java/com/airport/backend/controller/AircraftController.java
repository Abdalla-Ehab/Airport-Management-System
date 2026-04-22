package com.airport.backend.controller;

import com.airport.backend.entity.Aircraft;
import com.airport.backend.repository.AircraftRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/aircraft")
public class AircraftController {
    @Autowired
    private AircraftRepository aircraftRepository;

    @GetMapping
    public List<Aircraft> getAllAircraft() {
        return aircraftRepository.findAll();
    }
}