package com.airport.backend.controller;

import com.airport.backend.entity.StaffShift;
import com.airport.backend.repository.StaffShiftRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/shifts")
public class ShiftController {

    @Autowired
    private StaffShiftRepository shiftRepository;

    @PostMapping("/assign")
    public ResponseEntity<?> assignShift(@RequestBody StaffShift request) {
        // 1. Conflict Detection: Does this overlap with an existing shift?
        long conflicts = shiftRepository.countOverlappingShifts(
                request.getStaff_id(), request.getStart_time(), request.getEnd_time());

        if (conflicts > 0) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Scheduling Conflict: Employee is already working during this timeframe.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        request.setStatus("SCHEDULED");

        try {
            shiftRepository.save(request);
            Map<String, String> success = new HashMap<>();
            success.put("message", "Shift successfully assigned.");
            return ResponseEntity.ok(success);
        } catch (DataIntegrityViolationException e) {
            // This catches the 14-hour Fatigue MySQL Trigger we wrote!
            Map<String, String> error = new HashMap<>();
            error.put("error", "Safety Violation: Shift exceeds maximum 14-hour fatigue limit.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
}