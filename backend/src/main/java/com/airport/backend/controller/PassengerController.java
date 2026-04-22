package com.airport.backend.controller;

import com.airport.backend.entity.Passenger;
import com.airport.backend.repository.PassengerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/passengers")
public class PassengerController {

    @Autowired
    private PassengerRepository passengerRepository;

    @GetMapping
    public List<Passenger> getAllPassengers() {
        return passengerRepository.findAll();
    }
    // Add this new endpoint
    @GetMapping("/{id}")
    public Passenger getPassengerById(@PathVariable Long id) {
        return passengerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Passenger not found with id: " + id));
    }
}