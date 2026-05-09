package com.airport.backend.controller;

import com.airport.backend.dto.BaggageScanRequest;
import com.airport.backend.service.BaggageService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
@RestController
@RequestMapping("/api/baggage")
public class BaggageController {

    @Autowired
    private BaggageService baggageService;

    @PostMapping("/scan")
    public ResponseEntity<Map<String, String>> scanBaggage(@Valid @RequestBody BaggageScanRequest request) {
        return ResponseEntity.ok(baggageService.processScan(request));
    }
}