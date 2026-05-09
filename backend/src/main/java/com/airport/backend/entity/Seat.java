package com.airport.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "seat")
public class Seat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long seat_id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "aircraft_id")
    private Aircraft aircraft;

    private String seat_number;  // e.g., "1A", "12F"
    private String travel_class; // e.g., "First", "Business", "Economy"
    
    // Optional: Is this an exit row? Does it have extra legroom? 
    // private Boolean is_exit_row;

    // --- GETTERS AND SETTERS ---
    public Long getSeat_id() { return seat_id; }
    public void setSeat_id(Long seat_id) { this.seat_id = seat_id; }

    public Aircraft getAircraft() { return aircraft; }
    public void setAircraft(Aircraft aircraft) { this.aircraft = aircraft; }

    public String getSeat_number() { return seat_number; }
    public void setSeat_number(String seat_number) { this.seat_number = seat_number; }

    public String getTravel_class() { return travel_class; }
    public void setTravel_class(String travel_class) { this.travel_class = travel_class; }
}