package com.airport.backend.dto;

public class LoginRequest {
    private String username;
    private String password;
    
    // New fields for real registration
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String passportNo; // For passengers
    private String role;       // For staff
    private String dob;
    // private String passportNo;

    // Original Getters and Setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    // New Getters and Setters
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    
    public String getPassportNo() { return passportNo; }
    public void setPassportNo(String passportNo) { this.passportNo = passportNo; }
    
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getDob() {
        return dob;
    }
    public void setDob(String dob) {
        this.dob = dob;
    }
}