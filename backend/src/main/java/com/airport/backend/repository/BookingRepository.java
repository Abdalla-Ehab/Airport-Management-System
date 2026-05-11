package com.airport.backend.repository;

import com.airport.backend.entity.Booking;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository
        extends JpaRepository<Booking, Long> {

    // =====================================
    // COUNT BOOKINGS FOR FLIGHT
    // =====================================

    @Query("""
            SELECT COUNT(b)
            FROM Booking b
            WHERE b.flight.flight_id = :flightId
            """)
    long countBookingsByFlightId(
            @Param("flightId") Long flightId);

    // =====================================
    // GET BOOKED SEATS
    // =====================================

    @Query("""
            SELECT b.seat_no
            FROM Booking b
            WHERE b.flight.flight_id = :flightId
            """)
    List<String> findBookedSeatsByFlightId(
            @Param("flightId") Long flightId);

    // =====================================
    // CHECK DUPLICATE BOOKING
    // =====================================

    @Query("""
            SELECT COUNT(b)
            FROM Booking b
            WHERE b.flight.flight_id = :flightId
            AND b.passenger.passengerId = :passengerId
            """)
    long countByFlightAndPassenger(
            @Param("flightId") Long flightId,
            @Param("passengerId") Long passengerId);

    // =====================================
    // FIND BOOKINGS BY FLIGHT
    // =====================================

    @Query("""
            SELECT b
            FROM Booking b
            WHERE b.flight.flight_id = :flightId
            """)
    List<Booking> findByFlightId(
            @Param("flightId") Long flightId);

    // =====================================
    // FIND BOOKINGS BY PASSENGER
    // =====================================

    @Query("""
            SELECT b
            FROM Booking b
            WHERE b.passenger.passengerId = :passengerId
            """)
    List<Booking> findByPassengerId(
            @Param("passengerId") Long passengerId);
}