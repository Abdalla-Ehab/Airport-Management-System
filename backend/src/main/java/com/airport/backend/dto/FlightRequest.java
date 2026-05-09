package com.airport.backend.dto;

import java.time.LocalDateTime;

public class FlightRequest {
    private String flight_number;
    private Long aircraft_id;
    private Long airline_id;
    private Long departure_airport_id;
    private Long arrival_airport_id;
    private Long departure_gate_id;
    private LocalDateTime departure_time;
    private LocalDateTime arrival_time;

    // Getters and Setters
    public String getFlight_number() {
        return flight_number;
    }

    public void setFlight_number(String flight_number) {
        this.flight_number = flight_number;
    }

    public Long getAircraft_id() {
        return aircraft_id;
    }

    public void setAircraft_id(Long aircraft_id) {
        this.aircraft_id = aircraft_id;
    }

    public Long getAirline_id() {
        return airline_id;
    }

    public void setAirline_id(Long airline_id) {
        this.airline_id = airline_id;
    }

    public Long getDeparture_airport_id() {
        return departure_airport_id;
    }

    public void setDeparture_airport_id(Long departure_airport_id) {
        this.departure_airport_id = departure_airport_id;
    }

    public Long getArrival_airport_id() {
        return arrival_airport_id;
    }

    public void setArrival_airport_id(Long arrival_airport_id) {
        this.arrival_airport_id = arrival_airport_id;
    }

    public LocalDateTime getDeparture_time() {
        return departure_time;
    }

    public void setDeparture_time(LocalDateTime departure_time) {
        this.departure_time = departure_time;
    }

    public LocalDateTime getArrival_time() {
        return arrival_time;
    }

    public void setArrival_time(LocalDateTime arrival_time) {
        this.arrival_time = arrival_time;
    }

    public Long getDeparture_gate_id() {
        return departure_gate_id;
    }

    public void setDeparture_gate_id(Long departure_gate_id) {
        this.departure_gate_id = departure_gate_id;
    }

}