package com.airport.backend.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "security_log")
public class SecurityLog {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long check_id;
    private String type_of_check;
    private LocalDateTime date;
    private Long staff_id;
    private Long passenger_id;
    private String status;
    public Long getCheck_id() {
        return check_id;
    }
    public void setCheck_id(Long check_id) {
        this.check_id = check_id;
    }
    public String getType_of_check() {
        return type_of_check;
    }
    public void setType_of_check(String type_of_check) {
        this.type_of_check = type_of_check;
    }
    public LocalDateTime getDate() {
        return date;
    }
    public void setDate(LocalDateTime date) {
        this.date = date;
    }
    public Long getStaff_id() {
        return staff_id;
    }
    public void setStaff_id(Long staff_id) {
        this.staff_id = staff_id;
    }
    public Long getPassenger_id() {
        return passenger_id;
    }
    public void setPassenger_id(Long passenger_id) {
        this.passenger_id = passenger_id;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
}