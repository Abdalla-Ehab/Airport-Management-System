package com.airport.backend.service;

import com.airport.backend.entity.Aircraft;
import com.airport.backend.repository.AircraftRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AircraftService {

    @Autowired
    private AircraftRepository aircraftRepository;

    public List<Aircraft> getAllAircraft() {
        return aircraftRepository.findAll();
    }

    public Optional<Aircraft> getAircraftById(Long id) {
        return aircraftRepository.findById(id);
    }

    public Aircraft saveAircraft(Aircraft aircraft) {
        return aircraftRepository.save(aircraft);
    }

    public Aircraft updateStatus(Long id, String status) {
        Aircraft aircraft = aircraftRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Aircraft not found with id: " + id));
        aircraft.setStatus(status.toUpperCase());
        return aircraftRepository.save(aircraft);
    }
}
