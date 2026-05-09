package com.airport.backend.repository;

import com.airport.backend.entity.SeatMap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SeatMapRepository extends JpaRepository<SeatMap, Long> {
}