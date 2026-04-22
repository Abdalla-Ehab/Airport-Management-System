package com.airport.backend.repository;
import com.airport.backend.entity.Passenger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PassengerRepository extends JpaRepository<Passenger, Long> {
    Optional<Passenger> findByUsername(String username);
}