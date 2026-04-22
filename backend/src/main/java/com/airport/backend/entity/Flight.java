package com.airport.backend.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "flight")
public class Flight {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long flight_id;
    private LocalDateTime departure_time;
    private LocalDateTime arrival_time;
    private Long airline_id;
    private Long aircraft_id;
    private Long departure_gate_id;
    private Long arrival_gate_id;
    private Long departure_airport_id;
    private Long arrival_airport_id;
    public Long getFlight_id() {
        return flight_id;
    }
    public void setFlight_id(Long flight_id) {
        this.flight_id = flight_id;
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
    public Long getAirline_id() {
        return airline_id;
    }
    public void setAirline_id(Long airline_id) {
        this.airline_id = airline_id;
    }
    public Long getAircraft_id() {
        return aircraft_id;
    }
    public void setAircraft_id(Long aircraft_id) {
        this.aircraft_id = aircraft_id;
    }
    public Long getDeparture_gate_id() {
        return departure_gate_id;
    }
    public void setDeparture_gate_id(Long departure_gate_id) {
        this.departure_gate_id = departure_gate_id;
    }
    public Long getArrival_gate_id() {
        return arrival_gate_id;
    }
    public void setArrival_gate_id(Long arrival_gate_id) {
        this.arrival_gate_id = arrival_gate_id;
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
}