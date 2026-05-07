package com.airport.backend.dto;

public class BookFlightRequest {
    private Long flight_id;
    private Long passenger_id;
    private String class_name;
    private String seat_no;
    private Boolean is_transit;
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
    public String getSeat_no() {
        return seat_no;
    }
    public void setSeat_no(String seat_no) {
        this.seat_no = seat_no;
    }
    public Boolean getIs_transit() {
        return is_transit;
    }
    public void setIs_transit(Boolean is_transit) {
        this.is_transit = is_transit;
    }
    

    // Right-click -> Source Action -> Generate Getters and Setters here!
}