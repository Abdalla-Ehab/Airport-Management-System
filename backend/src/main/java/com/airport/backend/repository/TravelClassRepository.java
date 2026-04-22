package com.airport.backend.repository;
import com.airport.backend.entity.TravelClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TravelClassRepository extends JpaRepository<TravelClass, String> {}