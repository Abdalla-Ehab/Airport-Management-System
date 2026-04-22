package com.airport.backend.controller;

import com.airport.backend.entity.Staff;
import com.airport.backend.repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/staff")
public class StaffController {
    @Autowired
    private StaffRepository staffRepository;

    @GetMapping
    public List<Staff> getAllStaff() {
        return staffRepository.findAll();
    }
}