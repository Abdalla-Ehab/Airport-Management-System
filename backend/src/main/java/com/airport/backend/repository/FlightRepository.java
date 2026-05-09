package com.airport.backend.repository;

import com.airport.backend.entity.Flight;
// import com.airport.backend.enums.FlightStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface FlightRepository extends JpaRepository<Flight, Long> {

    // =====================================================
    // AIRCRAFT OVERLAP CHECK
    // =====================================================

    @Query("""
    SELECT f FROM Flight f
    WHERE f.aircraft.aircraft_id = :aircraftId
    AND f.status <> com.airport.backend.enums.FlightStatus.CANCELLED
    AND (
        f.departure_time < :arrivalTime
        AND
        f.arrival_time > :departureTime
    )
    """)
    List<Flight> findOverlappingAircraft(
            @Param("aircraftId") Long aircraftId,
            @Param("departureTime") LocalDateTime departureTime,
            @Param("arrivalTime") LocalDateTime arrivalTime
    );

    // =====================================================
    // DEPARTURE GATE OVERLAP CHECK
    // =====================================================

    @Query("""
    SELECT f FROM Flight f
    WHERE f.departureGate.gate_id = :gateId
    AND f.status <> com.airport.backend.enums.FlightStatus.CANCELLED
    AND (
        f.departure_time < :arrivalTime
        AND
        f.arrival_time > :departureTime
    )
    """)
    List<Flight> findOverlappingDepartureGate(
            @Param("gateId") Long gateId,
            @Param("departureTime") LocalDateTime departureTime,
            @Param("arrivalTime") LocalDateTime arrivalTime
    );

    // =====================================================
    // ARRIVAL GATE OVERLAP CHECK
    // =====================================================

    @Query("""
    SELECT f FROM Flight f
    WHERE f.arrivalGate.gate_id = :gateId
    AND f.status <> com.airport.backend.enums.FlightStatus.CANCELLED
    AND (
        f.departure_time < :arrivalTime
        AND
        f.arrival_time > :departureTime
    )
    """)
    List<Flight> findOverlappingArrivalGate(
            @Param("gateId") Long gateId,
            @Param("departureTime") LocalDateTime departureTime,
            @Param("arrivalTime") LocalDateTime arrivalTime
    );

    // =====================================================
    // FIND FLIGHTS BY ORIGIN + DESTINATION
    // =====================================================

    @Query("""
    SELECT f FROM Flight f
    WHERE LOWER(f.departureAirport.city) = LOWER(:origin)
    AND LOWER(f.arrivalAirport.city) = LOWER(:destination)
    """)
    List<Flight> findFlightsByRoute(
            @Param("origin") String origin,
            @Param("destination") String destination
    );
}