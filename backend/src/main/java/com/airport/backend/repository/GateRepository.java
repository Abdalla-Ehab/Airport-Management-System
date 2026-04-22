package com.airport.backend.repository;
import com.airport.backend.entity.Gate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GateRepository extends JpaRepository<Gate, Long> {}