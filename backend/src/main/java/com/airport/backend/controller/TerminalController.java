package com.airport.backend.controller;

import com.airport.backend.entity.Terminal;
import com.airport.backend.repository.TerminalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/terminals")
public class TerminalController {
    @Autowired
    private TerminalRepository terminalRepository;

    @GetMapping
    public List<Terminal> getAllTerminals() {
        return terminalRepository.findAll();
    }
}