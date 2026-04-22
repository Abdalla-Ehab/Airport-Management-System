package com.airport.backend.entity;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "staff")
public class Staff {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long staff_id;
    private Long dept_id;
    private Long supervisor_id;
    private String first_name;
    private String last_name;
    private String username;
    private String password;
    private String role;
    private LocalDate hire_date;
    public Long getStaff_id() {
        return staff_id;
    }
    public void setStaff_id(Long staff_id) {
        this.staff_id = staff_id;
    }
    public Long getDept_id() {
        return dept_id;
    }
    public void setDept_id(Long dept_id) {
        this.dept_id = dept_id;
    }
    public Long getSupervisor_id() {
        return supervisor_id;
    }
    public void setSupervisor_id(Long supervisor_id) {
        this.supervisor_id = supervisor_id;
    }
    public String getFirst_name() {
        return first_name;
    }
    public void setFirst_name(String first_name) {
        this.first_name = first_name;
    }
    public String getLast_name() {
        return last_name;
    }
    public void setLast_name(String last_name) {
        this.last_name = last_name;
    }
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public String getRole() {
        return role;
    }
    public void setRole(String role) {
        this.role = role;
    }
    public LocalDate getHire_date() {
        return hire_date;
    }
    public void setHire_date(LocalDate hire_date) {
        this.hire_date = hire_date;
    }
}