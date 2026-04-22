package com.airport.backend.repository;
import com.airport.backend.entity.BoardingPass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BoardingPassRepository extends JpaRepository<BoardingPass, Long> {}