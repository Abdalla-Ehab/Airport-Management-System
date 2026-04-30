package com.airport.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "airport")
public class Airport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long airport_id;

    private String name;
    
    // THE FIX: We replaced 'location' with these three new columns!
    private String city;
    private String country;
    private String iata_code;

    // ==========================================
    // GETTERS AND SETTERS
    // ==========================================
    
    public Long getAirport_id() { return airport_id; }
    public void setAirport_id(Long airport_id) { this.airport_id = airport_id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
    
    public String getIata_code() { return iata_code; }
    public void setIata_code(String iata_code) { this.iata_code = iata_code; }
}