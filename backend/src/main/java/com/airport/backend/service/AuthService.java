package com.airport.backend.service;

import com.airport.backend.dto.LoginRequest;
import com.airport.backend.dto.PassengerRegisterRequest; // Added import!
import com.airport.backend.dto.StaffRegisterRequest;     // Added import!
import com.airport.backend.entity.Passenger;
import com.airport.backend.entity.Staff;
import com.airport.backend.repository.PassengerRepository;
import com.airport.backend.repository.StaffRepository;
import com.airport.backend.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired private PassengerRepository passengerRepository;
    @Autowired private StaffRepository staffRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtService jwtService;

    // --- LOGIN LOGIC ---
    public Map<String, Object> authenticateUser(LoginRequest request) {
        // 1. Try Passenger Login
        Optional<Passenger> passengerOpt = passengerRepository.findByUsername(request.getUsername());
        if (passengerOpt.isPresent()) {
            Passenger passenger = passengerOpt.get();
            if (passwordEncoder.matches(request.getPassword(), passenger.getPassword())) {
                
                String token = createSpringSecurityToken(passenger.getUsername(), passenger.getPassword(), "ROLE_PASSENGER");
                
                return buildAuthResponse(token, passenger.getUsername(), "passenger", passenger.getPassengerId());
            }
        }

        // 2. Try Staff/Admin Login
        Optional<Staff> staffOpt = staffRepository.findByUsername(request.getUsername());
        if (staffOpt.isPresent()) {
            Staff staff = staffOpt.get();
            if (passwordEncoder.matches(request.getPassword(), staff.getPassword())) {
                
                String roleStr = "ROLE_" + staff.getRole().toUpperCase();
                String token = createSpringSecurityToken(staff.getUsername(), staff.getPassword(), roleStr);
                
                return buildAuthResponse(token, staff.getUsername(), staff.getRole().toLowerCase(), staff.getStaff_id());
            }
        }

        // 3. Fallback if neither matches
        throw new RuntimeException("Invalid username or password.");
    }

    private Map<String, Object> buildAuthResponse(String token, String username, String role, Long id) {
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("username", username);
        response.put("role", role);
        response.put("id", id);
        return response;
    }

    // --- HELPER: BRIDGE TO SPRING SECURITY ---
    private String createSpringSecurityToken(String username, String password, String role) {
        // 1. Add the role to the JWT payload so the React frontend can read it
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("role", role);

        // 2. Wrap the credentials in the official Spring Security UserDetails object
        UserDetails userDetails = User.withUsername(username)
                .password(password)
                .authorities(role)
                .build();

        // 3. Call your existing JwtService exactly how it expects to be called
        return jwtService.generateToken(extraClaims, userDetails);
    }

// --- REGISTRATION LOGIC ---
    @Transactional
    public void registerPassenger(PassengerRegisterRequest dto) {
        if (passengerRepository.findByUsername(dto.getUsername()).isPresent() ||
            staffRepository.findByUsername(dto.getUsername()).isPresent()) {
            throw new RuntimeException("Username is already taken.");
        }
        
        // Manual Mapping: The Firewall
        Passenger newPassenger = new Passenger();
        
        // Changed these to camelCase to match your Passenger entity!
        newPassenger.setFirstName(dto.getFirstName()); 
        newPassenger.setLastName(dto.getLastName());
        newPassenger.setEmail(dto.getEmail());
        newPassenger.setPhoneNumber(dto.getPhoneNumber());
        newPassenger.setPassportNo(dto.getPassportNo());
        newPassenger.setUsername(dto.getUsername());
        
        // Hash the password
        newPassenger.setPassword(passwordEncoder.encode(dto.getPassword()));
        
        passengerRepository.save(newPassenger);
    }

    @Transactional
    public void registerStaff(StaffRegisterRequest dto) {
        if (staffRepository.findByUsername(dto.getUsername()).isPresent() ||
            passengerRepository.findByUsername(dto.getUsername()).isPresent()) {
            throw new RuntimeException("Username is already taken.");
        }

        // Manual Mapping: The Firewall
        Staff newStaff = new Staff();
        newStaff.setFirst_name(dto.getFirst_name()); 
        newStaff.setLast_name(dto.getLast_name());
        newStaff.setEmail(dto.getEmail());
        newStaff.setPhone_number(dto.getPhone_number());
        newStaff.setRole(dto.getRole());
        newStaff.setDept_id(dto.getDept_id());
        newStaff.setUsername(dto.getUsername());

        // System-controlled fields
        newStaff.setPassword(passwordEncoder.encode(dto.getPassword()));
        newStaff.setHire_date(LocalDate.now());
        
        staffRepository.save(newStaff);
    }
} // <-- This is the missing bracket!