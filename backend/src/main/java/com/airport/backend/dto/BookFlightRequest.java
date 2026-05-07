package com.airport.backend.dto;
import java.util.List;

public class BookFlightRequest {
    private Long flight_id;
    private Long passenger_id;
    private List<String> seat_nos; // NEW: Expect an array of seats!
    private String class_name;
    private Boolean is_transit;

    public Long getFlight_id() { return flight_id; }
    public void setFlight_id(Long flight_id) { this.flight_id = flight_id; }
    public Long getPassenger_id() { return passenger_id; }
    public void setPassenger_id(Long passenger_id) { this.passenger_id = passenger_id; }
    
    public List<String> getSeat_nos() { return seat_nos; }
    public void setSeat_nos(List<String> seat_nos) { this.seat_nos = seat_nos; }
    
    public String getClass_name() { return class_name; }
    public void setClass_name(String class_name) { this.class_name = class_name; }
    public Boolean getIs_transit() { return is_transit; }
    public void setIs_transit(Boolean is_transit) { this.is_transit = is_transit; }
}