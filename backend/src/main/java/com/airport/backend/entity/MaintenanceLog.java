package com.airport.backend.entity;
import jakarta.persistence.*;

@Entity
@Table(name = "maintenance_log")
public class MaintenanceLog {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long maintenance_log_id;
    private Long maintenance_id;
    private Long equipment_id;
    private Long staff_id;
    private String status;
    public Long getMaintenance_log_id() {
        return maintenance_log_id;
    }
    public void setMaintenance_log_id(Long maintenance_log_id) {
        this.maintenance_log_id = maintenance_log_id;
    }
    public Long getMaintenance_id() {
        return maintenance_id;
    }
    public void setMaintenance_id(Long maintenance_id) {
        this.maintenance_id = maintenance_id;
    }
    public Long getEquipment_id() {
        return equipment_id;
    }
    public void setEquipment_id(Long equipment_id) {
        this.equipment_id = equipment_id;
    }
    public Long getStaff_id() {
        return staff_id;
    }
    public void setStaff_id(Long staff_id) {
        this.staff_id = staff_id;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
}