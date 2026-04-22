package com.airport.backend.entity;
import jakarta.persistence.*;

@Entity
@Table(name = "booking")
public class Booking {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ticket_no;
    private Long flight_id;
    private Long passenger_id;
    private String seat_no;
    private String class_name;
    private Boolean is_transit;
    public Long getTicket_no() {
        return ticket_no;
    }
    public void setTicket_no(Long ticket_no) {
        this.ticket_no = ticket_no;
    }
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
    public String getSeat_no() {
        return seat_no;
    }
    public void setSeat_no(String seat_no) {
        this.seat_no = seat_no;
    }
    public String getClass_name() {
        return class_name;
    }
    public void setClass_name(String class_name) {
        this.class_name = class_name;
    }
    public Boolean getIs_transit() {
        return is_transit;
    }
    public void setIs_transit(Boolean is_transit) {
        this.is_transit = is_transit;
    }
}