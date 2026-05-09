package com.airport.backend.controller;

import com.airport.backend.response.CheckInResponse;
import com.airport.backend.service.CheckInService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/checkin")
public class CheckInController {

    @Autowired
    private CheckInService checkInService;

    @PreAuthorize("hasRole('PASSENGER')")
    @PostMapping("/{ticketNo}")
    public ResponseEntity<CheckInResponse> generateBoardingPass(@PathVariable Long ticketNo, Authentication authentication) {
        // Notice how we pass authentication.getName() straight into the service!
        return ResponseEntity.ok(checkInService.generateBoardingPass(ticketNo, authentication.getName()));
    }
}