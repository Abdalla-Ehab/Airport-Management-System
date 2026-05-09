package com.airport.backend.service;

import com.airport.backend.response.CheckInResponse;

public interface CheckInService {
    CheckInResponse generateBoardingPass(Long ticketNo, String username);
}