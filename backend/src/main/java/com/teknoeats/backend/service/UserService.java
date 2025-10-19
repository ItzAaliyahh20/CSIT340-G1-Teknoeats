package com.teknoeats.backend.service;

import com.teknoeats.backend.dto.LoginRequest;
import com.teknoeats.backend.dto.SignupRequest;
import com.teknoeats.backend.dto.AuthResponse;
import com.teknoeats.backend.model.User;
import com.teknoeats.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public AuthResponse signup(SignupRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Create new user
        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setPassword(request.getPassword()); // In production, hash this!
        user.setRole(User.Role.valueOf(request.getRole().replace(" ", "_")));

        User savedUser = userRepository.save(user);

        return new AuthResponse(
                "User registered successfully",
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getRole().toString()
        );
    }

    public AuthResponse login(LoginRequest request) {
        // Find user by email or username
        User user = userRepository.findByEmail(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        // Check password (In production, use BCrypt!)
        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        return new AuthResponse(
                "Login successful",
                user.getId(),
                user.getEmail(),
                user.getRole().toString()
        );
    }
}