package com.airport.backend.entity;
import jakarta.persistence.*;

@Entity
@Table(name = "terminal")
public class Terminal {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long terminal_id;
    private String terminal_name;
    private Long airport_id;
    public Long getTerminal_id() {
        return terminal_id;
    }
    public void setTerminal_id(Long terminal_id) {
        this.terminal_id = terminal_id;
    }
    public String getTerminal_name() {
        return terminal_name;
    }
    public void setTerminal_name(String terminal_name) {
        this.terminal_name = terminal_name;
    }
    public Long getAirport_id() {
        return airport_id;
    }
    public void setAirport_id(Long airport_id) {
        this.airport_id = airport_id;
    }
}