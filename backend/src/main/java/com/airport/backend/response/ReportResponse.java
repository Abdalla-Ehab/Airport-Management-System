package com.airport.backend.response;

public class ReportResponse {
    private long totalFlights;
    private long totalPassengers;
    private long totalStaff;
    private long totalBookings;

    public ReportResponse() {
    }

    public ReportResponse(long totalFlights, long totalPassengers, long totalStaff, long totalBookings) {
        this.totalFlights = totalFlights;
        this.totalPassengers = totalPassengers;
        this.totalStaff = totalStaff;
        this.totalBookings = totalBookings;
    }

    public long getTotalFlights() {
        return totalFlights;
    }

    public void setTotalFlights(long totalFlights) {
        this.totalFlights = totalFlights;
    }

    public long getTotalPassengers() {
        return totalPassengers;
    }

    public void setTotalPassengers(long totalPassengers) {
        this.totalPassengers = totalPassengers;
    }

    public long getTotalStaff() {
        return totalStaff;
    }

    public void setTotalStaff(long totalStaff) {
        this.totalStaff = totalStaff;
    }

    public long getTotalBookings() {
        return totalBookings;
    }

    public void setTotalBookings(long totalBookings) {
        this.totalBookings = totalBookings;
    }
}
