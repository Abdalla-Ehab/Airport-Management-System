package com.airport.backend.repository;

import com.airport.backend.entity.BoardingPass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BoardingPassRepository extends JpaRepository<BoardingPass, Long> {
    
    // Custom SQL query to check if a boarding pass already exists for this ticket
    @Query("SELECT bp FROM BoardingPass bp WHERE bp.booking.ticket_no = :ticketNo")
    Optional<BoardingPass> findByTicketNumber(@Param("ticketNo") Long ticketNo);
    
}