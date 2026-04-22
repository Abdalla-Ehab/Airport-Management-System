package com.airport.backend.repository;
import com.airport.backend.entity.AirlineContact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AirlineContactRepository extends JpaRepository<AirlineContact, Long> {}