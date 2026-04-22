package com.airport.backend.repository;

import com.airport.backend.entity.Airport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AirportRepository extends JpaRepository<Airport, Long> {
    // JpaRepository gives us findAll(), findById(), save(), etc. automatically!
}