package com.airport.backend.response;

public record GateScanResponse(
    String seat, 
    String class_name
) {}