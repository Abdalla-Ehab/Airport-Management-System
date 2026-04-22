package com.airport.backend.controller;

import com.airport.backend.entity.Equipment;
import com.airport.backend.repository.EquipmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/equipment")
public class EquipmentController {
    @Autowired
    private EquipmentRepository equipmentRepository;

    @GetMapping
    public List<Equipment> getAllEquipment() {
        return equipmentRepository.findAll();
    }
}