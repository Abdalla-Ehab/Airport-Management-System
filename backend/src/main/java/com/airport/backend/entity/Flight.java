package com.airport.backend.entity;

import com.airport.backend.enums.FlightStatus;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "flight")
public class Flight {

    // =========================
    // PRIMARY KEY
    // =========================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "flight_id")
    private Long flight_id;


    // =========================
    // BASIC FLIGHT INFO
    // =========================

    @Column(name = "flight_number", nullable = false, unique = true)
    private String flight_number;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private FlightStatus status;

    @Column(name = "departure_time", nullable = false)
    private LocalDateTime departure_time;

    @Column(name = "arrival_time", nullable = false)
    private LocalDateTime arrival_time;


    // =========================
    // RELATIONSHIPS
    // =========================

    // Airline operating the flight
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "airline_id", nullable = false)
    private Airline airline;

    // Aircraft assigned to flight
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "aircraft_id", nullable = false)
    private Aircraft aircraft;

    // Departure gate
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "departure_gate_id", nullable = false)
    private Gate departureGate;

    // Arrival gate
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "arrival_gate_id", nullable = false)
    private Gate arrivalGate;

    // Departure airport
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "departure_airport_id", nullable = false)
    private Airport departureAirport;

    // Arrival airport
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "arrival_airport_id", nullable = false)
    private Airport arrivalAirport;


    // =========================
    // GETTERS AND SETTERS
    // =========================

    public Long getFlight_id() {
        return flight_id;
    }

    public void setFlight_id(Long flight_id) {
        this.flight_id = flight_id;
    }

    public String getFlight_number() {
        return flight_number;
    }

    public void setFlight_number(String flight_number) {
        this.flight_number = flight_number;
    }

    public FlightStatus getStatus() {
        return status;
    }

    public void setStatus(FlightStatus status) {
        this.status = status;
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

    public Airline getAirline() {
        return airline;
    }

    public void setAirline(Airline airline) {
        this.airline = airline;
    }

    public Aircraft getAircraft() {
        return aircraft;
    }

    public void setAircraft(Aircraft aircraft) {
        this.aircraft = aircraft;
    }

    public Gate getDepartureGate() {
        return departureGate;
    }

    public void setDepartureGate(Gate departureGate) {
        this.departureGate = departureGate;
    }

    public Gate getArrivalGate() {
        return arrivalGate;
    }

    public void setArrivalGate(Gate arrivalGate) {
        this.arrivalGate = arrivalGate;
    }

    public Airport getDepartureAirport() {
        return departureAirport;
    }

    public void setDepartureAirport(Airport departureAirport) {
        this.departureAirport = departureAirport;
    }

    public Airport getArrivalAirport() {
        return arrivalAirport;
    }

    public void setArrivalAirport(Airport arrivalAirport) {
        this.arrivalAirport = arrivalAirport;
    }
}