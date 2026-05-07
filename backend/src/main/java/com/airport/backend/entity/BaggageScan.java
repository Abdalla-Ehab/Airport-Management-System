package com.airport.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "baggage_scan")
public class BaggageScan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long scan_id;
    private Long baggage_id;
    private Long staff_id;
    private String scan_location;
    private LocalDateTime scan_time;

    // Getters and Setters
    public Long getScan_id() { return scan_id; }
    public void setScan_id(Long scan_id) { this.scan_id = scan_id; }
    public Long getBaggage_id() { return baggage_id; }
    public void setBaggage_id(Long baggage_id) { this.baggage_id = baggage_id; }
    public Long getStaff_id() { return staff_id; }
    public void setStaff_id(Long staff_id) { this.staff_id = staff_id; }
    public String getScan_location() { return scan_location; }
    public void setScan_location(String scan_location) { this.scan_location = scan_location; }
    public LocalDateTime getScan_time() { return scan_time; }
    public void setScan_time(LocalDateTime scan_time) { this.scan_time = scan_time; }
}