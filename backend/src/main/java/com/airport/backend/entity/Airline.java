package com.airport.backend.entity;
import jakarta.persistence.*;

@Entity
@Table(name = "airline")
public class Airline {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long airline_id;
    private String name;
    private String country;
    public Long getAirline_id() {
        return airline_id;
    }
    public void setAirline_id(Long airline_id) {
        this.airline_id = airline_id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getCountry() {
        return country;
    }
    public void setCountry(String country) {
        this.country = country;
    }
}