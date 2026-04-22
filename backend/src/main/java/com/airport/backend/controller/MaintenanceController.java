package com.airport.backend.controller;

import com.airport.backend.entity.MaintenanceRecord;
import com.airport.backend.repository.MaintenanceRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/maintenance")
public class MaintenanceController {
    @Autowired
    private MaintenanceRecordRepository maintenanceRepository;

    @GetMapping
    public List<MaintenanceRecord> getAllMaintenanceRecords() {
        return maintenanceRepository.findAll();
    }
}