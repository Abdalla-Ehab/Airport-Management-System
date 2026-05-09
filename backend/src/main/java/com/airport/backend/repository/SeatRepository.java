package com.airport.backend.repository;

import com.airport.backend.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {

    // 1. Get the entire seat map for a specific plane
    @Query("SELECT s FROM Seat s WHERE s.aircraft.aircraft_id = :aircraftId")
    List<Seat> findByAircraftId(@Param("aircraftId") Long aircraftId);

    // 2. Check if a specific seat (like "1A") exists on a specific plane
    @Query("SELECT s FROM Seat s WHERE s.aircraft.aircraft_id = :aircraftId AND s.seat_number = :seatNumber")
    Optional<Seat> findByAircraftIdAndSeatNumber(
            @Param("aircraftId") Long aircraftId, 
            @Param("seatNumber") String seatNumber
    );
}