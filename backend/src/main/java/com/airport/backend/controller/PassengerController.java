package com.airport.backend.controller;

import com.airport.backend.entity.Passenger;
import com.airport.backend.repository.PassengerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/passengers")
public class PassengerController {

    @Autowired
    private PassengerRepository passengerRepository;

    // =====================================================================
    // 1. STAFF/ADMIN ONLY: View all passengers in the database
    // =====================================================================
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    @GetMapping
    public List<Passenger> getAllPassengers() {
        return passengerRepository.findAll();
    }

    // =====================================================================
    // 2. PASSENGER (Self) OR STAFF/ADMIN: View specific passenger profile
    // =====================================================================
    @PreAuthorize("hasAnyRole('PASSENGER', 'STAFF', 'ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<?> getPassengerById(@PathVariable Long id) {

        // --- IDOR PROTECTION: Extract real identity from the JWT Token ---
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String loggedInUsername = auth.getName();
        
        // Check if the user is a Staff or Admin (they are allowed to look up anyone)
        boolean isStaffOrAdmin = auth.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ROLE_STAFF") || a.getAuthority().equals("ROLE_ADMIN"));

        if (!isStaffOrAdmin) {
            Optional<Passenger> loggedInUserOpt = passengerRepository.findByUsername(loggedInUsername);
            
            // If they are a regular passenger, the ID they requested MUST match their actual JWT ID
            if (loggedInUserOpt.isEmpty() || !loggedInUserOpt.get().getPassengerId().equals(id)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Security Violation: You can only access your own profile data."));
            }
        }
        // -----------------------------------------------------------------

        // If they passed the security check, fetch the profile
        Optional<Passenger> passengerOpt = passengerRepository.findById(id);
        if (passengerOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Passenger not found."));
        }

        return ResponseEntity.ok(passengerOpt.get());
    }

    // =====================================================================
    // 3. ADMIN ONLY: Update passenger profile
    // =====================================================================
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePassenger(@PathVariable Long id, @RequestBody Passenger passengerDetails) {
        Optional<Passenger> passengerOpt = passengerRepository.findById(id);
        if (passengerOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Passenger not found."));
        }

        Passenger passenger = passengerOpt.get();
        if (passengerDetails.getFirstName() != null) passenger.setFirstName(passengerDetails.getFirstName());
        if (passengerDetails.getLastName() != null) passenger.setLastName(passengerDetails.getLastName());
        if (passengerDetails.getEmail() != null) passenger.setEmail(passengerDetails.getEmail());
        if (passengerDetails.getPhoneNumber() != null) passenger.setPhoneNumber(passengerDetails.getPhoneNumber());
        if (passengerDetails.getPassportNo() != null) passenger.setPassportNo(passengerDetails.getPassportNo());
        if (passengerDetails.getDob() != null) passenger.setDob(passengerDetails.getDob());
        
        // We do NOT update the password or username here, those would require separate secure endpoints
        passengerRepository.save(passenger);

        return ResponseEntity.ok(passenger);
    }

    // =====================================================================
    // 4. ADMIN ONLY: Delete passenger
    // =====================================================================
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePassenger(@PathVariable Long id) {
        if (!passengerRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Passenger not found."));
        }
        passengerRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Passenger deleted successfully"));
    }
}