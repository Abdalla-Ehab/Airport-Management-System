package com.airport.backend.dto;

public class BookFlightRequest {
    private Long flight_id;
    private Long passenger_id;
    private String class_name;
    public Long getFlight_id() {
        return flight_id;
    }
    public void setFlight_id(Long flight_id) {
        this.flight_id = flight_id;
    }
    public Long getPassenger_id() {
        return passenger_id;
    }
    public void setPassenger_id(Long passenger_id) {
        this.passenger_id = passenger_id;
    }
    public String getClass_name() {
        return class_name;
    }
    public void setClass_name(String class_name) {
        this.class_name = class_name;
    }

    // Right-click -> Source Action -> Generate Getters and Setters here!
}