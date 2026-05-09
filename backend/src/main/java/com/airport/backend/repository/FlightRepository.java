package com.airport.backend.repository;

import com.airport.backend.entity.Flight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface FlightRepository extends JpaRepository<Flight, Long> {

    // 1. Check if the Aircraft is already flying during this time
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
            @Param("arrivalTime") LocalDateTime arrivalTime);

    // 2. Check if the Departure Gate is already occupied during this time
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
            @Param("arrivalTime") LocalDateTime arrivalTime);

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
            @Param("arrivalTime") LocalDateTime arrivalTime);
}