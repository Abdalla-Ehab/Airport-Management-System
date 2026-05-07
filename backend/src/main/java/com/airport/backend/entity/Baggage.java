package com.airport.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "baggage")
public class Baggage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long baggage_id;
    private String tag_number;
    private Double actual_weight;
    private String barcode;
    private String status;
    private String routing_path;

    public Long getBaggage_id() {
        return baggage_id;
    }

    public void setBaggage_id(Long baggage_id) {
        this.baggage_id = baggage_id;
    }

    public String getTag_number() {
        return tag_number;
    }

    public void setTag_number(String tag_number) {
        this.tag_number = tag_number;
    }

    public Double getActual_weight() {
        return actual_weight;
    }

    public void setActual_weight(Double actual_weight) {
        this.actual_weight = actual_weight;
    }

    public String getBarcode() {
        return barcode;
    }

    public void setBarcode(String barcode) {
        this.barcode = barcode;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getRouting_path() {
        return routing_path;
    }

    public void setRouting_path(String routing_path) {
        this.routing_path = routing_path;
    }
    
}