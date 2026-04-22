package com.airport.backend.repository;

import com.airport.backend.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    // Custom SQL query to count how many bookings exist for a specific flight
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.flight_id = ?1")
    long countBookingsByFlightId(Long flightId);
    
}