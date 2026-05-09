package com.airport.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class BookFlightRequest {
    
    @NotNull(message = "Flight ID is required")
    private Long flight_id;
    
    private Long passenger_id;
    
    @NotEmpty(message = "You must select at least one seat")
    private List<String> seat_nos;
    
    @NotBlank(message = "Class name cannot be blank")
    private String class_name;
    
    private Boolean is_transit;

    // Getters and Setters
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