package com.airport.backend.entity;

import com.airport.backend.enums.SeatClass;
import jakarta.persistence.*;

@Entity
@Table(name = "seat_map")
public class SeatMap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long seat_id;

    @Column(nullable = false)
    private String seat_number;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SeatClass seat_class;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "aircraft_id", nullable = false)
    private Aircraft aircraft;

    // =========================
    // GETTERS AND SETTERS
    // =========================

    public Long getSeat_id() {
        return seat_id;
    }

    public void setSeat_id(Long seat_id) {
        this.seat_id = seat_id;
    }

    public String getSeat_number() {
        return seat_number;
    }

    public void setSeat_number(String seat_number) {
        this.seat_number = seat_number;
    }

    public SeatClass getSeat_class() {
        return seat_class;
    }

    public void setSeat_class(SeatClass seat_class) {
        this.seat_class = seat_class;
    }

    public Aircraft getAircraft() {
        return aircraft;
    }

    public void setAircraft(Aircraft aircraft) {
        this.aircraft = aircraft;
    }
}