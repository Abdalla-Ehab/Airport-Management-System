package com.airport.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "airport")
public class Airport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long airport_id;

    private String name;
    private String location;

    // VS Code Tip: Right-click inside the class -> Source Action... -> Generate Getters and Setters
    public Long getAirport_id() { return airport_id; }
    public void setAirport_id(Long airport_id) { this.airport_id = airport_id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
}