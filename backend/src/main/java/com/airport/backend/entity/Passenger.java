package com.airport.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "passenger")
public class Passenger {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long passenger_id;

    private String passport_no;
    private String first_name;
    private String last_name;
    private LocalDate dob;
    
    // These match the columns we added for the login system
    private String username;
    private String password;
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getPhone_number() {
        return phone_number;
    }
    public void setPhone_number(String phone_number) {
        this.phone_number = phone_number;
    }
    private String email;
    private String phone_number;

    // Getters and Setters
    public Long getPassenger_id() { return passenger_id; }
    public void setPassenger_id(Long passenger_id) { this.passenger_id = passenger_id; }
    public String getPassport_no() { return passport_no; }
    public void setPassport_no(String passport_no) { this.passport_no = passport_no; }
    public String getFirst_name() { return first_name; }
    public void setFirst_name(String first_name) { this.first_name = first_name; }
    public String getLast_name() { return last_name; }
    public void setLast_name(String last_name) { this.last_name = last_name; }
    public LocalDate getDob() { return dob; }
    public void setDob(LocalDate dob) { this.dob = dob; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}