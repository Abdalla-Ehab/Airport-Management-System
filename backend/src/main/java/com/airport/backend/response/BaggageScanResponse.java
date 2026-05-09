package com.airport.backend.response;

public record BaggageScanResponse(
    String barcode, 
    String previous_status, 
    String new_status, 
    String location
) {}