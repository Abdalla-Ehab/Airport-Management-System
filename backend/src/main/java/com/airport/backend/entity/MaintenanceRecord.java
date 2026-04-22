package com.airport.backend.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "maintenance_record")
public class MaintenanceRecord {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long maintenance_id;
    private LocalDateTime date;
    private String work_done;
    private Integer duration_minutes;
    public Long getMaintenance_id() {
        return maintenance_id;
    }
    public void setMaintenance_id(Long maintenance_id) {
        this.maintenance_id = maintenance_id;
    }
    public LocalDateTime getDate() {
        return date;
    }
    public void setDate(LocalDateTime date) {
        this.date = date;
    }
    public String getWork_done() {
        return work_done;
    }
    public void setWork_done(String work_done) {
        this.work_done = work_done;
    }
    public Integer getDuration_minutes() {
        return duration_minutes;
    }
    public void setDuration_minutes(Integer duration_minutes) {
        this.duration_minutes = duration_minutes;
    }
}