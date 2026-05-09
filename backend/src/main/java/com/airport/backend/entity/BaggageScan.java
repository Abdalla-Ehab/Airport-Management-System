package com.airport.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "baggage_scan")
public class BaggageScan {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long scan_id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "baggage_id")
    private Baggage baggage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "staff_id")
    private Staff staff;

    private String scan_location;
    private LocalDateTime scan_time;

    // Getters and Setters
    public Long getScan_id() { return scan_id; }
    public void setScan_id(Long scan_id) { this.scan_id = scan_id; }

    public Baggage getBaggage() { return baggage; }
    public void setBaggage(Baggage baggage) { this.baggage = baggage; }

    public Staff getStaff() { return staff; }
    public void setStaff(Staff staff) { this.staff = staff; }

    public String getScan_location() { return scan_location; }
    public void setScan_location(String scan_location) { this.scan_location = scan_location; }

    public LocalDateTime getScan_time() { return scan_time; }
    public void setScan_time(LocalDateTime scan_time) { this.scan_time = scan_time; }
}