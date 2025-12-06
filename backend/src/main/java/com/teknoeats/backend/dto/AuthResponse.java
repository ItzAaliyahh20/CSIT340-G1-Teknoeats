package com.teknoeats.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String message;
    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
    private String role;
    private String token;
}