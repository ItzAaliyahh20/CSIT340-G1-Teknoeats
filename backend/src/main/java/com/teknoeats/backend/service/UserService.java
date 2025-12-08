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

        // Validate role - only Customer allowed for self-registration
        String role = request.getRole();
        if (!"Customer".equals(role)) {
            throw new RuntimeException("Invalid role. Only Customer role is allowed for self-registration.");
        }

        // Create new user
        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // In production, hash this!
        user.setRole(User.Role.Customer);

        User savedUser = userRepository.save(user);

        return new AuthResponse(
                "User registered successfully",
                savedUser.getId(),
                savedUser.getFirstName(),
                savedUser.getLastName(),
                savedUser.getEmail(),
                savedUser.getRole().toString(),
                "" // No token
        );
    }

    public AuthResponse login(LoginRequest request) {
        // Find user by email or username
        User user = userRepository.findByEmail(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        // Check if user has admin role - prevent admin login through regular endpoint
        if (user.getRole() == User.Role.Admin) {
            throw new RuntimeException("Admin access not allowed here. Please use the admin login page.");
        }

        // Debug logging
        System.out.println("Login attempt for email: " + request.getUsername());
        System.out.println("Input password: " + request.getPassword());
        System.out.println("Stored password hash: " + user.getPassword());

        // Verify password - handle both hashed and plain text for backward compatibility
        boolean passwordValid = false;
        String storedPassword = user.getPassword();

        System.out.println("Login attempt for email: " + user.getEmail());
        System.out.println("Input password: " + request.getPassword());
        System.out.println("Stored password: " + storedPassword);

        if (storedPassword.startsWith("$")) {
            // Password is hashed with BCrypt
            passwordValid = passwordEncoder.matches(request.getPassword(), storedPassword);
            System.out.println("Using BCrypt check, result: " + passwordValid);
        } else {
            // Password is plain text (legacy) - compare directly and re-hash
            passwordValid = request.getPassword().equals(storedPassword);
            System.out.println("Using plain text check, result: " + passwordValid);
            if (passwordValid) {
                // Re-hash the password for security
                user.setPassword(passwordEncoder.encode(request.getPassword()));
                userRepository.save(user);
                System.out.println("Password re-hashed for user: " + user.getEmail());
            }
        }

        if (!passwordValid) {
            System.out.println("Password validation failed");
            throw new RuntimeException("Invalid credentials");
        }

        System.out.println("Password validation successful");

        System.out.println("Login successful");

        return new AuthResponse(
                   "Login successful",
                   user.getId(),
                   user.getFirstName(),
                   user.getLastName(),
                   user.getEmail(),
                   user.getRole().toString(),
                   "" // No token
           );
      }

      public AuthResponse adminLogin(LoginRequest request) {
          // Find user by email or username
          User user = userRepository.findByEmail(request.getUsername())
                  .orElseThrow(() -> new RuntimeException("Invalid credentials"));

          // Check if user has admin role - only allow admin login through this endpoint
          if (user.getRole() != User.Role.Admin) {
              throw new RuntimeException("Access denied. Admin privileges required.");
          }

          // Debug logging
          System.out.println("Admin login attempt for email: " + request.getUsername());
          System.out.println("Input password: " + request.getPassword());
          System.out.println("Stored password hash: " + user.getPassword());

          // Verify password - handle both hashed and plain text for backward compatibility
          boolean passwordValid = false;
          String storedPassword = user.getPassword();

          System.out.println("Admin login attempt for email: " + user.getEmail());
          System.out.println("Input password: " + request.getPassword());
          System.out.println("Stored password: " + storedPassword);

          if (storedPassword.startsWith("$")) {
              // Password is hashed with BCrypt
              passwordValid = passwordEncoder.matches(request.getPassword(), storedPassword);
              System.out.println("Using BCrypt check, result: " + passwordValid);
          } else {
              // Password is plain text (legacy) - compare directly and re-hash
              passwordValid = request.getPassword().equals(storedPassword);
              System.out.println("Using plain text check, result: " + passwordValid);
              if (passwordValid) {
                  // Re-hash the password for security
                  user.setPassword(passwordEncoder.encode(request.getPassword()));
                  userRepository.save(user);
                  System.out.println("Password re-hashed for user: " + user.getEmail());
              }
          }

          if (!passwordValid) {
              System.out.println("Password validation failed");
              throw new RuntimeException("Invalid credentials");
          }

          System.out.println("Password validation successful");
          System.out.println("Admin login successful");

          return new AuthResponse(
                     "Admin login successful",
                     user.getId(),
                     user.getFirstName(),
                     user.getLastName(),
                     user.getEmail(),
                     user.getRole().toString(),
                     "" // No token
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