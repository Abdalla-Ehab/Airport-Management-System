package com.airport.backend.response;

import java.time.LocalDateTime;

public record ApiResponse<T>(
    boolean success,
    String message,
    T data,
    LocalDateTime timestamp
) {
    // Helper method for successful responses
    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(true, message, data, LocalDateTime.now());
    }

    // Helper method for error responses
    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, message, null, LocalDateTime.now());
    }
}