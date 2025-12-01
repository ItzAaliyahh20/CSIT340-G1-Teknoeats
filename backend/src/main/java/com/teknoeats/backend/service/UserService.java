package com.teknoeats.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.teknoeats.backend.dto.AuthResponse;
import com.teknoeats.backend.dto.LoginRequest;
import com.teknoeats.backend.dto.SignupRequest;
import com.teknoeats.backend.model.User;
import com.teknoeats.backend.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

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
        user.setPassword(passwordEncoder.encode(request.getPassword())); // In production, hash this!
        user.setRole(User.Role.valueOf(request.getRole().replace(" ", "_")));

        User savedUser = userRepository.save(user);

        return new AuthResponse(
                "User registered successfully",
                savedUser.getId(),
                savedUser.getFirstName(),
                savedUser.getLastName(),
                savedUser.getEmail(),
                savedUser.getRole().toString()
        );
    }

    public AuthResponse login(LoginRequest request) {
        // Find user by email or username
        User user = userRepository.findByEmail(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        // Debug logging
        System.out.println("Login attempt for email: " + request.getUsername());
        System.out.println("Input password: " + request.getPassword());
        System.out.println("Stored password hash: " + user.getPassword());

        // Verify password using BCrypt
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            System.out.println("Password mismatch");
            throw new RuntimeException("Invalid credentials");
        }

        System.out.println("Login successful");

        return new AuthResponse(
                 "Login successful",
                 user.getId(),
                 user.getFirstName(),
                 user.getLastName(),
                 user.getEmail(),
                 user.getRole().toString()
         );
     }

     public User getUserById(Long id) {
         return userRepository.findById(id)
                 .orElseThrow(() -> new RuntimeException("User not found"));
     }

     public User updateUser(Long id, User updatedUser) {
         User existingUser = getUserById(id);

         // Update fields (excluding password and role for security)
         existingUser.setFirstName(updatedUser.getFirstName());
         existingUser.setLastName(updatedUser.getLastName());
         existingUser.setEmail(updatedUser.getEmail());
         existingUser.setPhoneNumber(updatedUser.getPhoneNumber());
         existingUser.setAddress(updatedUser.getAddress());

         return userRepository.save(existingUser);
     }
}