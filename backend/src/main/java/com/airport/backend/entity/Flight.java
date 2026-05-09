package com.airport.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.airport.backend.enums.FlightStatus;

@Entity
@Table(name = "flight")
public class Flight {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long flight_id;

    private String flight_number;
    @Enumerated(EnumType.STRING)
    private FlightStatus status;    private LocalDateTime departure_time;
    private LocalDateTime arrival_time;

    // --- ENTERPRISE JPA RELATIONSHIPS ---
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "airline_id")
    private Airline airline;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "aircraft_id")
    private Aircraft aircraft;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "departure_gate_id")
    private Gate departureGate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "arrival_gate_id")
    private Gate arrivalGate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "departure_airport_id")
    private Airport departureAirport;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "arrival_airport_id")
    private Airport arrivalAirport;

    // --- GETTERS AND SETTERS ---
    public Long getFlight_id() { return flight_id; }
    public void setFlight_id(Long flight_id) { this.flight_id = flight_id; }

    public String getFlight_number() { return flight_number; }
    public void setFlight_number(String flight_number) { this.flight_number = flight_number; }


    public LocalDateTime getDeparture_time() { return departure_time; }
    public void setDeparture_time(LocalDateTime departure_time) { this.departure_time = departure_time; }

    public LocalDateTime getArrival_time() { return arrival_time; }
    public void setArrival_time(LocalDateTime arrival_time) { this.arrival_time = arrival_time; }

    public Airline getAirline() { return airline; }
    public void setAirline(Airline airline) { this.airline = airline; }

    public Aircraft getAircraft() { return aircraft; }
    public void setAircraft(Aircraft aircraft) { this.aircraft = aircraft; }

    public Gate getDepartureGate() { return departureGate; }
    public void setDepartureGate(Gate departureGate) { this.departureGate = departureGate; }

    public Gate getArrivalGate() { return arrivalGate; }
    public void setArrivalGate(Gate arrivalGate) { this.arrivalGate = arrivalGate; }

    public Airport getDepartureAirport() { return departureAirport; }
    public void setDepartureAirport(Airport departureAirport) { this.departureAirport = departureAirport; }

    public Airport getArrivalAirport() { return arrivalAirport; }
    public void setArrivalAirport(Airport arrivalAirport) { this.arrivalAirport = arrivalAirport; }
    public FlightStatus getStatus() {
        return status;
    }
    public void setStatus(FlightStatus status) {
        this.status = status;
    }
}