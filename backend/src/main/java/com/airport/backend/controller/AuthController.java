package com.airport.backend.controller;

import com.airport.backend.dto.LoginRequest;
import com.airport.backend.entity.Passenger;
import com.airport.backend.entity.Staff;
import com.airport.backend.repository.PassengerRepository;
import com.airport.backend.repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private PassengerRepository passengerRepository;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        
        // 1. Check if the user is a Staff member
        Optional<Staff> staffOpt = staffRepository.findByUsername(loginRequest.getUsername());
        if (staffOpt.isPresent()) {
            Staff staff = staffOpt.get();
            if (staff.getPassword().equals(loginRequest.getPassword())) {
                // Instead of a String, we return a Map which Spring Boot automatically converts to JSON
                Map<String, Object> response = new HashMap<>();
                response.put("id", staff.getStaff_id());
                response.put("username", staff.getUsername());
                
                // If your database has different staff roles (e.g., "security", "baggage"), you can pass it. 
                // The frontend checks for "staff" or "admin".
                String role = (staff.getRole() != null) ? staff.getRole().toLowerCase() : "staff";
                response.put("role", role); 
                
                return ResponseEntity.ok(response);
            }
        }

        // 2. Check if the user is a Passenger
        Optional<Passenger> passengerOpt = passengerRepository.findByUsername(loginRequest.getUsername());
        if (passengerOpt.isPresent()) {
            Passenger passenger = passengerOpt.get();
            if (passenger.getPassword().equals(loginRequest.getPassword())) {
                Map<String, Object> response = new HashMap<>();
                response.put("id", passenger.getPassenger_id());
                response.put("username", passenger.getUsername());
                response.put("role", "passenger"); // Tells the frontend to show passenger menus
                return ResponseEntity.ok(response);
            }
        }

        // 3. HARDCODED ADMIN (Since we don't have an Admin database table yet)
        if (loginRequest.getUsername().equals("admin") && loginRequest.getPassword().equals("admin123")) {
            Map<String, Object> response = new HashMap<>();
            response.put("id", 0);
            response.put("username", "System Admin");
            response.put("role", "admin"); // Tells the frontend to show the Admin menus
            return ResponseEntity.ok(response);
        }

        // 4. If neither matched, return an Unauthorized error
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Error: Invalid username or password!");
    }

    // ==========================================
    // NEW REGISTRATION ENDPOINTS FOR THE FRONTEND
    // ==========================================

    @PostMapping("/register/passenger")
    public ResponseEntity<?> registerPassenger(@RequestBody LoginRequest request) {
        if (passengerRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username already exists!");
        }

        Passenger p = new Passenger();
        p.setUsername(request.getUsername());
        p.setPassword(request.getPassword());
        
        // REAL DATA from the frontend
        p.setFirst_name(request.getFirstName());
        p.setLast_name(request.getLastName());
        p.setEmail(request.getEmail());
        p.setPhone_number(request.getPhone()); // Adjust to your exact entity variable name
        // p.setPassport_no(request.getPassportNo()); // Uncomment if you have this column!
        
        passengerRepository.save(p);
        return ResponseEntity.ok("Passenger registered successfully");
    }

    @PostMapping("/register/staff")
    public ResponseEntity<?> registerStaff(@RequestBody LoginRequest request) {
        if (staffRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username already exists!");
        }

        Staff s = new Staff();
        s.setUsername(request.getUsername());
        s.setPassword(request.getPassword());
        
        // REAL DATA from the frontend
        s.setFirst_name(request.getFirstName());
        s.setLast_name(request.getLastName());
        s.setEmail(request.getEmail());
        s.setPhone_number(request.getPhone());
        s.setRole(request.getRole()); // Let the admin decide their role!

        staffRepository.save(s);
        return ResponseEntity.ok("Staff registered successfully");
    }}