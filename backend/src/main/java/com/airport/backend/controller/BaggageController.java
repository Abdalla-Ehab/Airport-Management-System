package com.airport.backend.controller;

import com.airport.backend.entity.Baggage;
import com.airport.backend.entity.BaggageScan;
import com.airport.backend.repository.BaggageRepository;
import com.airport.backend.repository.BaggageScanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/baggage")
public class BaggageController {

    @Autowired private BaggageRepository baggageRepository;
    @Autowired private BaggageScanRepository baggageScanRepository;

    @PostMapping("/scan")
    @Transactional
    public ResponseEntity<?> scanBaggage(@RequestBody Map<String, Object> payload) {
        String barcode = (String) payload.get("barcode");
        Long staffId = ((Number) payload.get("staff_id")).longValue();
        String location = (String) payload.get("location");
        String overrideStatus = (String) payload.get("override_status"); // e.g., manually marking as "LOST"

        Optional<Baggage> bagOpt = baggageRepository.findByBarcode(barcode);
        if (bagOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Barcode not recognized in the system."));
        }

        Baggage bag = bagOpt.get();
        String oldStatus = bag.getStatus();
        String newStatus;

        // 1. STATE MACHINE LOGIC: Advance the baggage status automatically
        if (overrideStatus != null && !overrideStatus.isBlank()) {
            newStatus = overrideStatus.toUpperCase(); // Admin/Staff manual override
        } else {
            newStatus = switch (oldStatus) {
                case "CHECKED_IN" -> "LOADED";
                case "LOADED" -> "ARRIVED";
                case "ARRIVED" -> "CLAIMED";
                case "CLAIMED" -> "CLAIMED"; // Terminal state
                case "LOST" -> "FOUND_IN_TRANSIT";
                default -> oldStatus;
            };
        }

        bag.setStatus(newStatus);
        baggageRepository.save(bag);

        // 2. LOG THE SCAN FOR THE AUDIT TRAIL
        BaggageScan scan = new BaggageScan();
        scan.setBaggage_id(bag.getBaggage_id());
        scan.setStaff_id(staffId);
        scan.setScan_location(location);
        scan.setScan_time(LocalDateTime.now());
        baggageScanRepository.save(scan);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Scan Successful.");
        response.put("barcode", barcode);
        response.put("previous_status", oldStatus);
        response.put("new_status", newStatus);
        response.put("location", location);

        return ResponseEntity.ok(response);
    }
}