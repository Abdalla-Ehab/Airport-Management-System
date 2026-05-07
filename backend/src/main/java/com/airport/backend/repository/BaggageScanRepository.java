package com.airport.backend.repository;

import com.airport.backend.entity.BaggageScan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BaggageScanRepository extends JpaRepository<BaggageScan, Long> {
}