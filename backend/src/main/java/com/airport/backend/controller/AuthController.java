package com.airport.backend.controller;

import com.airport.backend.entity.Passenger;
import com.airport.backend.entity.Staff;
import com.airport.backend.repository.PassengerRepository;
import com.airport.backend.repository.StaffRepository;
import com.airport.backend.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
// import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private PassengerRepository passengerRepository;
    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // Hashes passwords
    @Autowired
    private AuthenticationManager authenticationManager; // Verifies passwords
    @Autowired
    private JwtService jwtService; // Generates Tokens
    @Autowired
    private UserDetailsService userDetailsService;

    // ==========================================
    // 1. SECURE LOGIN (Dispenses JWT Token)
    // ==========================================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");

        try {
            // 1. Let Spring Security check the BCrypt password
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );
            // 2. If successful, generate the JWT Token
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            String token = jwtService.generateToken(userDetails);

            // 3. Determine if they are Staff or Passenger and send back their data + Token
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("username", username);

            Optional<Staff> staffOpt = staffRepository.findByUsername(username);
            if (staffOpt.isPresent()) {
                response.put("id", staffOpt.get().getStaff_id());
                response.put("role", staffOpt.get().getRole().toLowerCase());
                return ResponseEntity.ok(response);
            }

            Optional<Passenger> passOpt = passengerRepository.findByUsername(username);
            if (passOpt.isPresent()) {
                response.put("id", passOpt.get().getPassengerId());
                response.put("role", "passenger");
                return ResponseEntity.ok(response);
            }

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Role not found"));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid credentials"));
        }
    }

    // ==========================================
    // 2. SECURE PASSENGER REGISTRATION
    // ==========================================
    @PostMapping("/register/passenger")
    public ResponseEntity<?> registerPassenger(@RequestBody Passenger passenger) {
        if (passengerRepository.findByUsername(passenger.getUsername()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username already exists");
        }

        // HASH THE PASSWORD BEFORE SAVING!
        passenger.setPassword(passwordEncoder.encode(passenger.getPassword()));
        passengerRepository.save(passenger);

        return ResponseEntity.ok(Map.of("message", "Passenger registered securely"));
    }

    // ==========================================
    // 3. SECURE STAFF REGISTRATION
    // ==========================================
    @PreAuthorize("hasRole('ADMIN')") // THIS LOCKS THE DOOR!
    @PostMapping("/register/staff")
    public ResponseEntity<?> registerStaff(@RequestBody Staff staff) {
        if (staffRepository.findByUsername(staff.getUsername()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username already exists");
        }

        // HASH THE PASSWORD BEFORE SAVING!
        staff.setPassword(passwordEncoder.encode(staff.getPassword()));
        staffRepository.save(staff);

        return ResponseEntity.ok(Map.of("message", "Staff registered securely"));
    }
}