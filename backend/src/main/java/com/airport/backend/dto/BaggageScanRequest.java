package com.airport.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class BaggageScanRequest {
    @NotBlank(message = "Barcode is required")
    private String barcode;
    
    @NotNull(message = "Staff ID is required")
    private Long staff_id;
    
    @NotBlank(message = "Location is required")
    private String location;
    
    private String override_status;

    // Getters and Setters
    public String getBarcode() { return barcode; }
    public void setBarcode(String barcode) { this.barcode = barcode; }
    public Long getStaff_id() { return staff_id; }
    public void setStaff_id(Long staff_id) { this.staff_id = staff_id; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getOverride_status() { return override_status; }
    public void setOverride_status(String override_status) { this.override_status = override_status; }
}