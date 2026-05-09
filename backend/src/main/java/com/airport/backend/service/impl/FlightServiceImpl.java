package com.airport.backend.service.impl;

import com.airport.backend.dto.FlightRequest;
import com.airport.backend.entity.*;
import com.airport.backend.enums.FlightStatus;
import com.airport.backend.exception.custom.ResourceNotFoundException;
import com.airport.backend.repository.*;
import com.airport.backend.response.FlightResponse;
import com.airport.backend.service.FlightService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FlightServiceImpl implements FlightService {

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private AirportRepository airportRepository;

    @Autowired
    private AircraftRepository aircraftRepository;

    @Autowired
    private AirlineRepository airlineRepository;

    @Autowired
    private GateRepository gateRepository;

    // =========================================================
    // GET ALL FLIGHTS
    // =========================================================

    @Override
    public List<FlightResponse> getAllFlights() {

        return flightRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // =========================================================
    // GET FLIGHT BY ID
    // =========================================================

    @Override
    public FlightResponse getFlightById(Long id) {

        Flight flight = flightRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Flight not found with ID: " + id
                        )
                );

        return mapToResponse(flight);
    }

    // =========================================================
    // SCHEDULE FLIGHT
    // =========================================================

    @Override
    @Transactional
    public FlightResponse scheduleFlight(FlightRequest dto) {

        // =====================================================
        // 1. BASIC VALIDATION
        // =====================================================

        if (dto.getDeparture_time().isAfter(dto.getArrival_time())) {

            throw new RuntimeException(
                    "Scheduling Error: Departure time must be before arrival time!"
            );
        }

        if (dto.getDeparture_airport_id()
                .equals(dto.getArrival_airport_id())) {

            throw new RuntimeException(
                    "Scheduling Error: Departure and arrival airports cannot be the same!"
            );
        }

        // =====================================================
        // 2. AIRCRAFT OVERLAP CHECK
        // =====================================================

        List<Flight> aircraftConflicts =
                flightRepository.findOverlappingAircraft(
                        dto.getAircraft_id(),
                        dto.getDeparture_time(),
                        dto.getArrival_time()
                );

        if (!aircraftConflicts.isEmpty()) {

            throw new RuntimeException(
                    "Scheduling Error: Aircraft is already assigned to another flight during this time!"
            );
        }

        // =====================================================
        // 3. DEPARTURE GATE OVERLAP CHECK
        // =====================================================

        if (dto.getDeparture_gate_id() != null) {

            List<Flight> departureGateConflicts =
                    flightRepository.findOverlappingDepartureGate(
                            dto.getDeparture_gate_id(),
                            dto.getDeparture_time(),
                            dto.getArrival_time()
                    );

            if (!departureGateConflicts.isEmpty()) {

                throw new RuntimeException(
                        "Scheduling Error: Departure gate is occupied during this time!"
                );
            }
        }

        // =====================================================
        // 4. ARRIVAL GATE OVERLAP CHECK
        // =====================================================

        if (dto.getArrival_gate_id() != null) {

            List<Flight> arrivalGateConflicts =
                    flightRepository.findOverlappingArrivalGate(
                            dto.getArrival_gate_id(),
                            dto.getDeparture_time(),
                            dto.getArrival_time()
                    );

            if (!arrivalGateConflicts.isEmpty()) {

                throw new RuntimeException(
                        "Scheduling Error: Arrival gate is occupied during this time!"
                );
            }
        }

        // =====================================================
        // 5. OBJECT LOOKUPS
        // =====================================================

        Airport depAirport =
                airportRepository.findById(dto.getDeparture_airport_id())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Departure Airport not found"
                                )
                        );

        Airport arrAirport =
                airportRepository.findById(dto.getArrival_airport_id())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Arrival Airport not found"
                                )
                        );

        Aircraft aircraft =
                aircraftRepository.findById(dto.getAircraft_id())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Aircraft not found"
                                )
                        );

        Airline airline =
                airlineRepository.findById(dto.getAirline_id())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Airline not found"
                                )
                        );

        Gate depGate =
                dto.getDeparture_gate_id() != null
                        ? gateRepository.findById(
                                dto.getDeparture_gate_id()
                        ).orElse(null)
                        : null;

        Gate arrGate =
                dto.getArrival_gate_id() != null
                        ? gateRepository.findById(
                                dto.getArrival_gate_id()
                        ).orElse(null)
                        : null;

        // =====================================================
        // 6. ENTITY MAPPING
        // =====================================================

        Flight newFlight = new Flight();

        newFlight.setFlight_number(dto.getFlight_number());

        newFlight.setDeparture_time(dto.getDeparture_time());

        newFlight.setArrival_time(dto.getArrival_time());

        // Default Status
        newFlight.setStatus(FlightStatus.SCHEDULED);

        newFlight.setDepartureAirport(depAirport);

        newFlight.setArrivalAirport(arrAirport);

        newFlight.setAircraft(aircraft);

        newFlight.setAirline(airline);

        newFlight.setDepartureGate(depGate);

        newFlight.setArrivalGate(arrGate);

        // =====================================================
        // 7. SAVE
        // =====================================================

        Flight savedFlight = flightRepository.save(newFlight);

        return mapToResponse(savedFlight);
    }

    // =========================================================
    // FIND FLIGHTS
    // =========================================================

    @Override
    public List<FlightResponse> findFlights(
            String origin,
            String destination
    ) {

        return flightRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // =========================================================
    // ENTITY -> RESPONSE DTO
    // =========================================================

    private FlightResponse mapToResponse(Flight flight) {

        return new FlightResponse(

                flight.getFlight_id(),

                flight.getFlight_number(),

                flight.getStatus() != null
                        ? flight.getStatus().name()
                        : null,

                flight.getDeparture_time(),

                flight.getArrival_time(),

                flight.getAirline() != null
                        ? flight.getAirline().getAirline_id()
                        : null,

                flight.getAircraft() != null
                        ? flight.getAircraft().getAircraft_id()
                        : null,

                flight.getDepartureGate() != null
                        ? flight.getDepartureGate().getGate_id()
                        : null,

                flight.getArrivalGate() != null
                        ? flight.getArrivalGate().getGate_id()
                        : null,

                flight.getDepartureAirport() != null
                        ? flight.getDepartureAirport().getAirport_id()
                        : null,

                flight.getArrivalAirport() != null
                        ? flight.getArrivalAirport().getAirport_id()
                        : null
        );
    }
}