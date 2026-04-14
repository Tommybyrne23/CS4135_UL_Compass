package com.ulcompass.auth_service.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class RegisterRequestDTO {

    @Email
    @Pattern(
        regexp = ".*@(studentmail\\.ul\\.ie|ul\\.ie)$",
        message = "Must be a valid UL email address"
    )
    private String email;

    @NotBlank
    @Pattern(
        regexp = "^(?=.*[A-Z])(?=.*[0-9])(?=.*[@!#_]).{8,}$",
        message = "Password must be 8+ chars with one capital, one number, one special character"
    )
    private String password;
}
