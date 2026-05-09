package com.airport.backend.service;

import com.airport.backend.dto.BaggageScanRequest;
import java.util.Map;

public interface BaggageService {
    Map<String, String> processScan(BaggageScanRequest request);
}