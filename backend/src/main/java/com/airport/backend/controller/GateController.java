package com.airport.backend.controller;

import com.airport.backend.entity.Gate;
import com.airport.backend.repository.GateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/gates")
public class GateController {
    @Autowired
    private GateRepository gateRepository;

    @GetMapping
    public List<Gate> getAllGates() {
        return gateRepository.findAll();
    }
}