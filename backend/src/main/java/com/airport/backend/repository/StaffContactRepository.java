package com.airport.backend.repository;
import com.airport.backend.entity.StaffContact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StaffContactRepository extends JpaRepository<StaffContact, Long> {}