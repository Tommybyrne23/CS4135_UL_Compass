package com.ulcompass.auth_service.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    private UserRole role = UserRole.STUDENT;

    @Enumerated(EnumType.STRING)
    private AccountStatus status = AccountStatus.PENDING;

    private int failedLoginAttempts = 0;

    public enum UserRole { STUDENT, STAFF, ADMIN }

    public enum AccountStatus { PENDING, ACTIVE, LOCKED, LOGGED_OUT }

    public boolean isValidForLogin() {
        return this.status == AccountStatus.ACTIVE;
    }

    public void recordFailedAttempt() {
        this.failedLoginAttempts++;
        if (this.failedLoginAttempts >= 3) {
            this.status = AccountStatus.LOCKED;
        }
    }

    public void resetFailedAttempts() {
        this.failedLoginAttempts = 0;
    }
}
