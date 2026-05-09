package com.airport.backend.entity;
import jakarta.persistence.*;

@Entity
@Table(name = "booking")
public class Booking {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ticket_no;

    // --- ENTERPRISE JPA RELATIONSHIPS ---
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flight_id")
    private Flight flight;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "passenger_id")
    private Passenger passenger;
    // ------------------------------------

    private String seat_no;
    private String class_name;
    private Boolean is_transit;

    public Long getTicket_no() {
        return ticket_no;
    }
    public void setTicket_no(Long ticket_no) {
        this.ticket_no = ticket_no;
    }

    // --- UPDATED GETTERS AND SETTERS FOR OBJECTS ---
    public Flight getFlight() {
        return flight;
    }
    public void setFlight(Flight flight) {
        this.flight = flight;
    }

    public Passenger getPassenger() {
        return passenger;
    }
    public void setPassenger(Passenger passenger) {
        this.passenger = passenger;
    }
    // -----------------------------------------------

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