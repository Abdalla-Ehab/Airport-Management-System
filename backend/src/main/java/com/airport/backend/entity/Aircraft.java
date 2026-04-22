package com.airport.backend.entity;
import jakarta.persistence.*;

@Entity
@Table(name = "aircraft")
public class Aircraft {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long aircraft_id;
    private String registration_no;
    private String type;
    private Long airline_id;
    private Integer number_of_seats;
    public Long getAircraft_id() {
        return aircraft_id;
    }
    public void setAircraft_id(Long aircraft_id) {
        this.aircraft_id = aircraft_id;
    }
    public String getRegistration_no() {
        return registration_no;
    }
    public void setRegistration_no(String registration_no) {
        this.registration_no = registration_no;
    }
    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }
    public Long getAirline_id() {
        return airline_id;
    }
    public void setAirline_id(Long airline_id) {
        this.airline_id = airline_id;
    }
    public Integer getNumber_of_seats() {
        return number_of_seats;
    }
    public void setNumber_of_seats(Integer number_of_seats) {
        this.number_of_seats = number_of_seats;
    }
}