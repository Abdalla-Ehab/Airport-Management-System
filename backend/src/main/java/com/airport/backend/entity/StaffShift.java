package com.airport.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "staff_shift")
public class StaffShift {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long shift_id;
    private Long staff_id;
    private LocalDateTime start_time;
    private LocalDateTime end_time;
    private String role_assigned;
    private String status;

    // Getters and Setters
    public Long getShift_id() { return shift_id; }
    public void setShift_id(Long shift_id) { this.shift_id = shift_id; }
    public Long getStaff_id() { return staff_id; }
    public void setStaff_id(Long staff_id) { this.staff_id = staff_id; }
    public LocalDateTime getStart_time() { return start_time; }
    public void setStart_time(LocalDateTime start_time) { this.start_time = start_time; }
    public LocalDateTime getEnd_time() { return end_time; }
    public void setEnd_time(LocalDateTime end_time) { this.end_time = end_time; }
    public String getRole_assigned() { return role_assigned; }
    public void setRole_assigned(String role_assigned) { this.role_assigned = role_assigned; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}