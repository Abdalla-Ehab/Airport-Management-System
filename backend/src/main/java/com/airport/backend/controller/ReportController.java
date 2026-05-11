package com.airport.backend.controller;

import com.airport.backend.response.ApiResponse;
import com.airport.backend.response.ReportResponse;
import com.airport.backend.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<ReportResponse>> getSystemSummary() {
        try {
            ReportResponse summary = reportService.generateSystemSummary();
            return ResponseEntity.ok(ApiResponse.success("System summary generated successfully", summary));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
