package com.airport.backend.controller;

import com.airport.backend.entity.Terminal;
import com.airport.backend.repository.TerminalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize; // 1. Added Import
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/terminals")
public class TerminalController {
    
    @Autowired
    private TerminalRepository terminalRepository;

    // 1. PUBLIC: Anyone can see the list of terminals
    @GetMapping
    public List<Terminal> getAllTerminals() {
        return terminalRepository.findAll();
    }

    // 2. ADMIN ONLY: Future-proofing for adding new terminals
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Terminal> addTerminal(@RequestBody Terminal terminal) {
        return ResponseEntity.ok(terminalRepository.save(terminal));
    }
}