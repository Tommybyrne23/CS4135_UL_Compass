package com.ulcompass.auth_service.service;

import com.ulcompass.auth_service.dto.*;
import com.ulcompass.auth_service.entity.User;
import com.ulcompass.auth_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponseDTO registerUser(RegisterRequestDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        User user = new User();
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setStatus(User.AccountStatus.ACTIVE);
        User saved = userRepository.save(user);
        String token = jwtService.generateToken(saved);
        return new AuthResponseDTO(saved.getId(), token, saved.getRole().name());
    }

    public AuthResponseDTO login(LoginRequestDTO dto) {
        if (!dto.isCaptchaValid()) {
            throw new RuntimeException("CAPTCHA validation required");
        }
        User user = userRepository.findByEmail(dto.getEmail())
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.isValidForLogin()) {
            throw new RuntimeException("Account is locked or inactive");
        }
        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            user.recordFailedAttempt();
            userRepository.save(user);
            throw new RuntimeException("Invalid credentials");
        }
        user.resetFailedAttempts();
        user.setStatus(User.AccountStatus.ACTIVE);
        userRepository.save(user);
        String token = jwtService.generateToken(user);
        return new AuthResponseDTO(user.getId(), token, user.getRole().name());
    }

    public void changePassword(String userId, String newPassword) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        // JWT is stateless — old token becomes invalid when new one is issued
    }

    public void unlockAccount(String userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus(User.AccountStatus.ACTIVE);
        user.resetFailedAttempts();
        userRepository.save(user);
    }
}