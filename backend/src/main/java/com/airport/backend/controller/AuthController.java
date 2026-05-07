package com.airport.backend.controller;

import com.airport.backend.dto.LoginRequest;
import com.airport.backend.dto.StaffRegisterRequest;
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
import java.time.LocalDate;

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
        // 1. Check for duplicates
        if (passengerRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username already exists!");
        }

        Passenger p = new Passenger();
        
        // 2. Account Credentials
        p.setUsername(request.getUsername());
        p.setPassword(request.getPassword());
        
        // 3. Basic Contact Info
        p.setFirst_name(request.getFirstName());
        p.setLast_name(request.getLastName());
        p.setEmail(request.getEmail());
        p.setPhone_number(request.getPhone()); 
        
        // 4. THE FIX: Required Identity Fields
        // This converts the "YYYY-MM-DD" string from the frontend into a real Java Date
        p.setDob(LocalDate.parse(request.getDob())); 
        p.setPassport_no(request.getPassportNo());
        
        // 5. Save to Database
        passengerRepository.save(p);
        
        return ResponseEntity.ok("Passenger registered successfully");
    }

    @PostMapping("/register/staff")
    public ResponseEntity<?> registerStaff(@RequestBody StaffRegisterRequest request) { // FIX: Uses the new DTO!
        if (staffRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username already exists!");
        }

        Staff s = new Staff();
        s.setUsername(request.getUsername());
        s.setPassword(request.getPassword());
        
        // REAL DATA from the frontend mapping exactly to the new DTO names
        s.setFirst_name(request.getFirst_name());
        s.setLast_name(request.getLast_name());
        s.setEmail(request.getEmail());
        s.setPhone_number(request.getPhone_number());
        
        // FIX: Add the Missing Required Fields for the Database
        s.setDept_id(request.getDept_id()); 
        
        // Safely set the hire date (defaults to today if not provided)
        if (request.getHire_date() != null) {
            s.setHire_date(request.getHire_date());
        } else {
            s.setHire_date(LocalDate.now());
        }
        
        // ==========================================
        // Server-Side Role Validation
        // ==========================================
        String requestedRole = request.getRole();
        
        // 1. If no role is provided, default to a standard staff member
        if (requestedRole == null || requestedRole.trim().isEmpty()) {
            s.setRole("staff");
        } else {
            String cleanRole = requestedRole.trim().toLowerCase();
            
            // 2. BLOCK ADMIN ESCALATION: Never allow a user to assign themselves admin rights
            if (cleanRole.equals("admin") || cleanRole.equals("system admin")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Security Violation: Cannot assign admin privileges.");
            }
            
            // 3. Save the clean, safe role
            s.setRole(cleanRole);
        }

        try {
            staffRepository.save(s);
            return ResponseEntity.ok("Staff registered successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Database error: " + e.getMessage());
        }
    }
}