package com.airport.backend.entity;
import jakarta.persistence.*;

@Entity
@Table(name = "gate")
public class Gate {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long gate_id;
    private String status;
    private Long terminal_id;
    public Long getGate_id() {
        return gate_id;
    }
    public void setGate_id(Long gate_id) {
        this.gate_id = gate_id;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
    public Long getTerminal_id() {
        return terminal_id;
    }
    public void setTerminal_id(Long terminal_id) {
        this.terminal_id = terminal_id;
    }
}