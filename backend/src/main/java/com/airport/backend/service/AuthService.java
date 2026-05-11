package com.airport.backend.service;

import com.airport.backend.dto.LoginRequest;
import com.airport.backend.dto.PassengerRegisterRequest;
import com.airport.backend.dto.StaffRegisterRequest;

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

    @Autowired
    private PassengerRepository passengerRepository;

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;


    // =====================================================
    // LOGIN
    // =====================================================

    public Map<String, Object> authenticateUser(
            LoginRequest request) {

        // =========================================
        // PASSENGER LOGIN
        // =========================================

        Optional<Passenger> passengerOpt =
                passengerRepository.findByUsername(
                        request.getUsername()
                );

        if (passengerOpt.isPresent()) {

            Passenger passenger =
                    passengerOpt.get();

            if (
                    passwordEncoder.matches(
                            request.getPassword(),
                            passenger.getPassword()
                    )
            ) {

                String token =
                        createSpringSecurityToken(
                                passenger.getUsername(),
                                passenger.getPassword(),
                                "ROLE_PASSENGER"
                        );

                return buildAuthResponse(
                        token,
                        passenger.getUsername(),
                        "passenger",
                        passenger.getPassengerId()
                );
            }
        }

        // =========================================
        // STAFF / ADMIN LOGIN
        // =========================================

        Optional<Staff> staffOpt =
                staffRepository.findByUsername(
                        request.getUsername()
                );

        if (staffOpt.isPresent()) {

            Staff staff =
                    staffOpt.get();

            if (
                    passwordEncoder.matches(
                            request.getPassword(),
                            staff.getPassword()
                    )
            ) {

                String roleName = staff.getRole().toUpperCase().replace(" ", "_");
                if (!roleName.startsWith("ROLE_")) {
                    roleName = "ROLE_" + roleName;
                }

                String token =
                        createSpringSecurityToken(
                                staff.getUsername(),
                                staff.getPassword(),
                                roleName
                        );

                return buildAuthResponse(
                        token,
                        staff.getUsername(),
                        staff.getRole().toLowerCase(),
                        staff.getStaff_id()
                );
            }
        }

        // =========================================
        // INVALID LOGIN
        // =========================================

        throw new RuntimeException(
                "Invalid username or password."
        );
    }


    // =====================================================
    // BUILD AUTH RESPONSE
    // =====================================================

    private Map<String, Object> buildAuthResponse(
            String token,
            String username,
            String role,
            Long id
    ) {

        Map<String, Object> response =
                new HashMap<>();

        response.put("token", token);

        response.put("username", username);

        response.put("role", role);

        response.put("id", id);

        return response;
    }


    // =====================================================
    // JWT TOKEN CREATION
    // =====================================================

    private String createSpringSecurityToken(
            String username,
            String password,
            String role
    ) {

        Map<String, Object> extraClaims =
                new HashMap<>();

        extraClaims.put(
                "role",
                role
        );

        UserDetails userDetails =
                User.withUsername(username)
                        .password(password)
                        .authorities(role)
                        .build();

        return jwtService.generateToken(
                extraClaims,
                userDetails
        );
    }


    // =====================================================
    // PASSENGER REGISTRATION
    // =====================================================

    @Transactional
    public void registerPassenger(
            PassengerRegisterRequest dto
    ) {

        // =========================================
        // USERNAME CHECK
        // =========================================

        if (
                passengerRepository.findByUsername(
                        dto.getUsername()
                ).isPresent()

                        ||

                staffRepository.findByUsername(
                        dto.getUsername()
                ).isPresent()
        ) {

            throw new RuntimeException(
                    "Username is already taken."
            );
        }

        // =========================================
        // DOB VALIDATION
        // =========================================

        if (
                dto.getDob() == null ||
                dto.getDob().isBlank()
        ) {

            throw new RuntimeException(
                    "Date of birth is required."
            );
        }

        LocalDate dob;

        try {

            dob =
                    LocalDate.parse(
                            dto.getDob()
                    );

        } catch (Exception e) {

            throw new RuntimeException(
                    "Invalid date format."
            );
        }

        if (
                dob.isAfter(
                        LocalDate.now()
                )
        ) {

            throw new RuntimeException(
                    "Date of birth cannot be in the future."
            );
        }

        // =========================================
        // CREATE PASSENGER
        // =========================================

        Passenger newPassenger =
                new Passenger();

        newPassenger.setFirstName(
                dto.getFirstName()
        );

        newPassenger.setLastName(
                dto.getLastName()
        );

        newPassenger.setEmail(
                dto.getEmail()
        );

        newPassenger.setPhoneNumber(
                dto.getPhoneNumber()
        );

        newPassenger.setPassportNo(
                dto.getPassportNo()
        );

        newPassenger.setUsername(
                dto.getUsername()
        );

        // =========================================
        // IMPORTANT FIX
        // =========================================

        newPassenger.setDob(
                dob
        );

        // =========================================
        // HASH PASSWORD
        // =========================================

        newPassenger.setPassword(
                passwordEncoder.encode(
                        dto.getPassword()
                )
        );

        // =========================================
        // SAVE
        // =========================================

        passengerRepository.save(
                newPassenger
        );
    }


    // =====================================================
    // STAFF REGISTRATION
    // =====================================================

    @Transactional
    public void registerStaff(
            StaffRegisterRequest dto
    ) {

        if (
                staffRepository.findByUsername(
                        dto.getUsername()
                ).isPresent()

                        ||

                passengerRepository.findByUsername(
                        dto.getUsername()
                ).isPresent()
        ) {

            throw new RuntimeException(
                    "Username is already taken."
            );
        }

        Staff newStaff =
                new Staff();

        newStaff.setFirst_name(
                dto.getFirst_name()
        );

        newStaff.setLast_name(
                dto.getLast_name()
        );

        newStaff.setEmail(
                dto.getEmail()
        );

        newStaff.setPhone_number(
                dto.getPhone_number()
        );

        newStaff.setRole(
                dto.getRole()
        );

        newStaff.setDept_id(
                dto.getDept_id()
        );

        newStaff.setUsername(
                dto.getUsername()
        );

        newStaff.setPassword(
                passwordEncoder.encode(
                        dto.getPassword()
                )
        );

        newStaff.setHire_date(
                LocalDate.now()
        );

        staffRepository.save(
                newStaff
        );
    }
}