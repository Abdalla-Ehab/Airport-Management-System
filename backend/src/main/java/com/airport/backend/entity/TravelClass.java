package com.airport.backend.entity;
import jakarta.persistence.*;

@Entity
@Table(name = "travel_class")
public class TravelClass {
    @Id
    private String class_name;
    private Double allowed_weight;
    public String getClass_name() {
        return class_name;
    }
    public void setClass_name(String class_name) {
        this.class_name = class_name;
    }
    public Double getAllowed_weight() {
        return allowed_weight;
    }
    public void setAllowed_weight(Double allowed_weight) {
        this.allowed_weight = allowed_weight;
    }
}