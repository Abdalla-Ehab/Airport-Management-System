package com.airport.backend.repository;

import com.airport.backend.entity.Baggage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface BaggageRepository extends JpaRepository<Baggage, Long> {
    Optional<Baggage> findByBarcode(String barcode); // NEW: Look up by Barcode
}