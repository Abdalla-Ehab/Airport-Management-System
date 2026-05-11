package com.airport.backend.config;

import com.airport.backend.entity.Staff;
import com.airport.backend.repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Optional;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        
        // Check if our master admin already exists
        Optional<Staff> adminOpt = staffRepository.findByUsername("admin");
        
        if (adminOpt.isEmpty()) {
            Staff admin = new Staff();
            
            // NOTE: If your Staff entity uses camelCase (e.g. setFirstName), 
            // just update these method names to match your entity!
            admin.setFirst_name("System");
            admin.setLast_name("Administrator");
            admin.setEmail("admin@aeronexus.com");
            admin.setPhone_number("0000000000");
            admin.setUsername("admin");
            admin.setDept_id(1L);
            
            // CRITICAL: We must hash the password before saving!
            admin.setPassword(passwordEncoder.encode("admin123"));
            
            // THE FIX: Use the strict Enum object instead of a String
            admin.setRole("ADMIN"); 
            admin.setHire_date(LocalDate.now());

            staffRepository.save(admin);
            System.out.println("✅ SECURITY ALERT: Default Master Admin account created! (Username: admin | Password: admin123)");
        }
    }
}