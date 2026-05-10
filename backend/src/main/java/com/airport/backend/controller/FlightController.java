package com.airport.backend.controller;

import com.airport.backend.dto.FlightRequest;
import com.airport.backend.response.ApiResponse;
import com.airport.backend.response.FlightResponse;
import com.airport.backend.service.FlightService;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flights")
public class FlightController {

    @Autowired
    private FlightService flightService;


    // =====================================================
    // GET ALL FLIGHTS
    // =====================================================

    @GetMapping
    public ResponseEntity<ApiResponse<List<FlightResponse>>> getAllFlights() {

        List<FlightResponse> flights =
                flightService.getAllFlights();

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Flights retrieved successfully",
                        flights
                )
        );
    }


    // =====================================================
    // FLIGHT STATUS
    // =====================================================

    @GetMapping("/status")
    public ResponseEntity<ApiResponse<List<FlightResponse>>> getFlightStatus() {

        List<FlightResponse> flights =
                flightService.getAllFlights();

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Flight status loaded",
                        flights
                )
        );
    }


    // =====================================================
    // SEARCH FLIGHTS
    // =====================================================

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<FlightResponse>>> searchFlights(

            @RequestParam Long origin,

            @RequestParam Long destination

    ) {

        List<FlightResponse> flights =
                flightService.findFlights(
                        origin,
                        destination
                );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Flights found",
                        flights
                )
        );
    }


    // =====================================================
    // SCHEDULE NEW FLIGHT
    // =====================================================

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ApiResponse<FlightResponse>> scheduleFlight(
            @RequestBody FlightRequest request) {

        try {

            FlightResponse savedFlight =
                    flightService.scheduleFlight(request);

            return ResponseEntity.ok(
                    ApiResponse.success(
                            "Flight scheduled successfully",
                            savedFlight
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(
                    ApiResponse.error(
                            e.getMessage()
                    )
            );
        }
    }
}