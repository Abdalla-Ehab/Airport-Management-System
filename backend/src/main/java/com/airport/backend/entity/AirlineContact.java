package com.airport.backend.entity;
import jakarta.persistence.*;

@Entity
@Table(name = "airline_contact")
public class AirlineContact {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long contact_id;
    private Long airline_id;
    private String contact_type;
    private String value;
    public Long getContact_id() {
        return contact_id;
    }
    public void setContact_id(Long contact_id) {
        this.contact_id = contact_id;
    }
    public Long getAirline_id() {
        return airline_id;
    }
    public void setAirline_id(Long airline_id) {
        this.airline_id = airline_id;
    }
    public String getContact_type() {
        return contact_type;
    }
    public void setContact_type(String contact_type) {
        this.contact_type = contact_type;
    }
    public String getValue() {
        return value;
    }
    public void setValue(String value) {
        this.value = value;
    }
}