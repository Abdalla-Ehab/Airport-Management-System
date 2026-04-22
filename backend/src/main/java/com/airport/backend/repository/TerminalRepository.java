package com.airport.backend.repository;
import com.airport.backend.entity.Terminal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TerminalRepository extends JpaRepository<Terminal, Long> {}