package com.airport.backend.controller;

import com.airport.backend.entity.Baggage;
import com.airport.backend.repository.BaggageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/baggage")
public class BaggageController {
    @Autowired
    private BaggageRepository baggageRepository;

    @GetMapping
    public List<Baggage> getAllBaggage() {
        return baggageRepository.findAll();
    }
}