package com.airport.backend.repository;

import com.airport.backend.entity.StaffShift;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface StaffShiftRepository extends JpaRepository<StaffShift, Long> {

    // SMART QUERY: Check if a staff member already has a shift that overlaps with
    // these times
    @Query("SELECT COUNT(s) FROM StaffShift s WHERE s.staff_id = :staffId " +
            "AND ((s.start_time <= :endTime AND s.end_time >= :startTime))")
    long countOverlappingShifts(@Param("staffId") Long staffId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime);
}