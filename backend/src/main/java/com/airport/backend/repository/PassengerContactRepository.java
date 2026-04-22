package com.airport.backend.repository;
import com.airport.backend.entity.PassengerContact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PassengerContactRepository extends JpaRepository<PassengerContact, Long> {}