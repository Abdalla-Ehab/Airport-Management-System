package com.airport.backend.service.impl;

import com.airport.backend.repository.BookingRepository;
import com.airport.backend.repository.FlightRepository;
import com.airport.backend.repository.PassengerRepository;
import com.airport.backend.repository.StaffRepository;
import com.airport.backend.response.ReportResponse;
import com.airport.backend.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ReportServiceImpl implements ReportService {

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private PassengerRepository passengerRepository;

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Override
    public ReportResponse generateSystemSummary() {
        long totalFlights = flightRepository.count();
        long totalPassengers = passengerRepository.count();
        long totalStaff = staffRepository.count();
        long totalBookings = bookingRepository.count();

        return new ReportResponse(totalFlights, totalPassengers, totalStaff, totalBookings);
    }
}
