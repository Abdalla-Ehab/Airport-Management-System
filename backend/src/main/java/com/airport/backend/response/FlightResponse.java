package com.airport.backend.response;

import java.time.LocalDateTime;

public class FlightResponse {
    private Long flight_id;
    private String flight_number;
    private String status;
    private LocalDateTime departure_time;
    private LocalDateTime arrival_time;
    private Long airline_id;
    private Long aircraft_id;
    private Long departure_gate_id;
    private Long arrival_gate_id;
    private Long departure_airport_id;
    private Long arrival_airport_id;

    public FlightResponse(Long flight_id, String flight_number, String status, LocalDateTime departure_time, LocalDateTime arrival_time, Long airline_id, Long aircraft_id, Long departure_gate_id, Long arrival_gate_id, Long departure_airport_id, Long arrival_airport_id) {
        this.flight_id = flight_id;
        this.flight_number = flight_number;
        this.status = status;
        this.departure_time = departure_time;
        this.arrival_time = arrival_time;
        this.airline_id = airline_id;
        this.aircraft_id = aircraft_id;
        this.departure_gate_id = departure_gate_id;
        this.arrival_gate_id = arrival_gate_id;
        this.departure_airport_id = departure_airport_id;
        this.arrival_airport_id = arrival_airport_id;
    }

    // Getters
    public Long getFlight_id() { return flight_id; }
    public String getFlight_number() { return flight_number; }
    public String getStatus() { return status; }
    public LocalDateTime getDeparture_time() { return departure_time; }
    public LocalDateTime getArrival_time() { return arrival_time; }
    public Long getAirline_id() { return airline_id; }
    public Long getAircraft_id() { return aircraft_id; }
    public Long getDeparture_gate_id() { return departure_gate_id; }
    public Long getArrival_gate_id() { return arrival_gate_id; }
    public Long getDeparture_airport_id() { return departure_airport_id; }
    public Long getArrival_airport_id() { return arrival_airport_id; }
}