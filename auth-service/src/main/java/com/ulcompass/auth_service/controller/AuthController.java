package com.ulcompass.auth_service.controller;

import com.ulcompass.auth_service.dto.*;
import com.ulcompass.auth_service.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> register(@Valid @RequestBody RegisterRequestDTO dto) {
        return ResponseEntity.status(201).body(authService.registerUser(dto));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody LoginRequestDTO dto) {
        return ResponseEntity.ok(authService.login(dto));
    }

    @PutMapping("/password/{userId}")
    public ResponseEntity<Void> changePassword(
            @PathVariable String userId,
            @RequestParam String newPassword) {
        authService.changePassword(userId, newPassword);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/unlock/{userId}")
    public ResponseEntity<Void> unlockAccount(@PathVariable String userId) {
        authService.unlockAccount(userId);
        return ResponseEntity.noContent().build();
    }
}
