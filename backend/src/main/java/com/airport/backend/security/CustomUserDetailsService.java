package com.airport.backend.security;

import com.airport.backend.entity.Passenger;
import com.airport.backend.entity.Staff;
import com.airport.backend.repository.PassengerRepository;
import com.airport.backend.repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private PassengerRepository passengerRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        // 1. Try to find a Staff member
        Optional<Staff> staffOpt = staffRepository.findByUsername(username);
        if (staffOpt.isPresent()) {
            Staff staff = staffOpt.get();
            // Prefix role with "ROLE_" for Spring Security RBAC conventions
            String role = "ROLE_" + staff.getRole().name();
            return new User(staff.getUsername(), staff.getPassword(),
                    Collections.singletonList(new SimpleGrantedAuthority(role)));
        }

        // 2. Try to find a Passenger
        Optional<Passenger> passOpt = passengerRepository.findByUsername(username);
        if (passOpt.isPresent()) {
            Passenger passenger = passOpt.get();
            return new User(passenger.getUsername(), passenger.getPassword(),
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_PASSENGER")));
        }

        throw new UsernameNotFoundException("User not found with username: " + username);
    }
}