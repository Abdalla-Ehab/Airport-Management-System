package com.airport.backend.service.impl;

import com.airport.backend.dto.BaggageScanRequest;
import com.airport.backend.entity.AuditLog;
import com.airport.backend.entity.Baggage;
import com.airport.backend.entity.BaggageScan;
import com.airport.backend.entity.Staff;
import com.airport.backend.exception.custom.ResourceNotFoundException;
import com.airport.backend.repository.AuditLogRepository;
import com.airport.backend.repository.BaggageRepository;
import com.airport.backend.repository.BaggageScanRepository;
import com.airport.backend.repository.StaffRepository;
import com.airport.backend.service.BaggageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class BaggageServiceImpl implements BaggageService {

    @Autowired private BaggageRepository baggageRepository;
    @Autowired private BaggageScanRepository baggageScanRepository;
    @Autowired private StaffRepository staffRepository; 
    @Autowired private AuditLogRepository auditLogRepository; // SECURITY: Added for tracking

    @Override
    @Transactional
    public Map<String, String> processScan(BaggageScanRequest request) {
        // 1. Fetch the Bag
        Baggage bag = baggageRepository.findByBarcode(request.getBarcode())
                .orElseThrow(() -> new ResourceNotFoundException("Barcode not recognized in the system."));

        // 2. Fetch the Staff member performing the scan
        Staff staff = staffRepository.findById(request.getStaff_id())
                .orElseThrow(() -> new ResourceNotFoundException("Staff ID " + request.getStaff_id() + " not found."));

        String oldStatus = bag.getStatus();
        String newStatus;

        // 3. STATE MACHINE LOGIC
        if (request.getOverride_status() != null && !request.getOverride_status().isBlank()) {
            newStatus = request.getOverride_status().toUpperCase();
        } else {
            newStatus = switch (oldStatus) {
                case "CHECKED_IN" -> "LOADED";
                case "LOADED" -> "ARRIVED";
                case "ARRIVED" -> "CLAIMED";
                case "CLAIMED" -> "CLAIMED";
                case "LOST" -> "FOUND_IN_TRANSIT";
                default -> oldStatus;
            };
        }

        bag.setStatus(newStatus);
        baggageRepository.save(bag);

        // 4. BAG TRACKING TRAIL 
        BaggageScan scan = new BaggageScan();
        scan.setBaggage(bag); 
        scan.setStaff(staff); 
        scan.setScan_location(request.getLocation());
        scan.setScan_time(LocalDateTime.now());
        baggageScanRepository.save(scan);

        // 5. SECURITY AUDIT LOGGING
        String auditDetails = "Scanned bag " + request.getBarcode() + " at " + request.getLocation();
        auditLogRepository.save(new AuditLog(staff.getUsername(), "BAGGAGE_SCAN", auditDetails));

        Map<String, String> response = new HashMap<>();
        response.put("message", "Scan Successful.");
        response.put("barcode", request.getBarcode());
        response.put("previous_status", oldStatus);
        response.put("new_status", newStatus);
        response.put("location", request.getLocation());

        return response;
    }
}