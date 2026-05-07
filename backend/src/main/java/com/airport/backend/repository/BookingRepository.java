package com.airport.backend.repository;

import com.airport.backend.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    // Custom SQL query to count how many bookings exist for a specific flight
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.flight_id = ?1")
    long countBookingsByFlightId(Long flightId);
    
    // NEW: Fetch all occupied seats for a specific flight to power the Visual Seat Map!
    @Query("SELECT b.seat_no FROM Booking b WHERE b.flight_id = :flightId")
    List<String> findBookedSeatsByFlightId(@Param("flightId") Long flightId);
    
}