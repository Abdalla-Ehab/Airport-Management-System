package com.airport.backend.repository;
import com.airport.backend.entity.MaintenanceLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MaintenanceLogRepository extends JpaRepository<MaintenanceLog, Long> {}