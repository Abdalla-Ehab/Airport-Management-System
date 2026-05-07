package com.airport.backend.dto;

import java.time.LocalDate;

public class StaffRegisterRequest {
    private String first_name;
    private String last_name;
    private String username;
    private String password;
    private String email;
    private String phone_number;
    private String role;
    private LocalDate hire_date;
    
    // THIS IS THE MISSING PIECE!
    private Long dept_id; 

    // ==========================================
    // GETTERS AND SETTERS
    // ==========================================
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

    public String getPhone_number() { return phone_number; }
    public void setPhone_number(String phone_number) { this.phone_number = phone_number; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public LocalDate getHire_date() { return hire_date; }
    public void setHire_date(LocalDate hire_date) { this.hire_date = hire_date; }

    public Long getDept_id() { return dept_id; }
    public void setDept_id(Long dept_id) { this.dept_id = dept_id; }
}