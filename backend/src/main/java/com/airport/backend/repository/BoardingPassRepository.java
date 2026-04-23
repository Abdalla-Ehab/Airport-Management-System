package com.airport.backend.repository;

import com.airport.backend.entity.BoardingPass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BoardingPassRepository extends JpaRepository<BoardingPass, Long> {
    
    // Custom SQL query to check if a boarding pass already exists for this ticket
    @Query("SELECT b FROM BoardingPass b WHERE b.ticket_no = ?1")
    Optional<BoardingPass> findByTicketNumber(Long ticketNo);
    
}