package com.airport.backend.entity;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "staff")
public class Staff {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long staff_id;

    // --- ENTERPRISE JPA RELATIONSHIPS ---
    // Note: If you create a Department entity later, you'll change dept_id to an object too!
    private Long dept_id; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supervisor_id")
    private Staff supervisor; // SELF-JOIN: A staff member has a supervisor who is also staff
    // ------------------------------------

    private String first_name;
    private String last_name;
    private String username;
    private String password;
    
    private String role;
    
    private String email;
    private String phone_number;
    private LocalDate hire_date;

    // --- GETTERS AND SETTERS ---
    public Long getStaff_id() { return staff_id; }
    public void setStaff_id(Long staff_id) { this.staff_id = staff_id; }

    public Long getDept_id() { return dept_id; }
    public void setDept_id(Long dept_id) { this.dept_id = dept_id; }

    public Staff getSupervisor() { return supervisor; }
    public void setSupervisor(Staff supervisor) { this.supervisor = supervisor; }

    public String getFirst_name() { return first_name; }
    public void setFirst_name(String first_name) { this.first_name = first_name; }

    public String getLast_name() { return last_name; }
    public void setLast_name(String last_name) { this.last_name = last_name; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getPhone_number() { return phone_number; }
    public void setPhone_number(String phone_number) { this.phone_number = phone_number; }

    public LocalDate getHire_date() { return hire_date; }
    public void setHire_date(LocalDate hire_date) { this.hire_date = hire_date; }
}