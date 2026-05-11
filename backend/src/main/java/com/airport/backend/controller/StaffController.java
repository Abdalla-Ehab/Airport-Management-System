package com.airport.backend.controller;

import com.airport.backend.entity.Staff;
import com.airport.backend.repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/staff")
public class StaffController {
    @Autowired
    private StaffRepository staffRepository;

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping
    public List<Staff> getAllStaff() {
        return staffRepository.findAll();
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<?> getStaffById(@PathVariable Long id) {
        Optional<Staff> staffOpt = staffRepository.findById(id);
        if (staffOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Staff not found."));
        }
        return ResponseEntity.ok(staffOpt.get());
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateStaff(@PathVariable Long id, @RequestBody Staff staffDetails) {
        Optional<Staff> staffOpt = staffRepository.findById(id);
        if (staffOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Staff not found."));
        }

        Staff staff = staffOpt.get();
        if (staffDetails.getFirst_name() != null) staff.setFirst_name(staffDetails.getFirst_name());
        if (staffDetails.getLast_name() != null) staff.setLast_name(staffDetails.getLast_name());
        if (staffDetails.getEmail() != null) staff.setEmail(staffDetails.getEmail());
        if (staffDetails.getPhone_number() != null) staff.setPhone_number(staffDetails.getPhone_number());
        if (staffDetails.getRole() != null) staff.setRole(staffDetails.getRole());
        
        staffRepository.save(staff);

        return ResponseEntity.ok(staff);
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStaff(@PathVariable Long id) {
        if (!staffRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Staff not found."));
        }
        staffRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Staff deleted successfully"));
    }
}