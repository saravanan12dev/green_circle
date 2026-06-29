package com.example.Green_Circle.controller;

import com.example.Green_Circle.entity.User;
import com.example.Green_Circle.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", allowCredentials = "true")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @RequestMapping(value = { "/register", "/login" }, method = RequestMethod.OPTIONS)
    public ResponseEntity<?> handleOptions() {
        return ResponseEntity.ok().build();
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            // Check if account already exists
            if (userRepository.findByEmail(user.getEmail()) != null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "status", "failed",
                    "message", "Email address is already registered!"
                ));
            }

            // 🔒 PASSWORD HASHING NOTE
            // Production Architecture Standard: Inject BCryptPasswordEncoder here:
            // String hashedPassword = passwordEncoder.encode(user.getPassword());
            // user.setPassword(hashedPassword);
            // Currently storing plain text until Spring Security dependency configuration is active.
            
            if (user.getTrustFactorStatus() == null) {
                user.setTrustFactorStatus("VERIFIED_ID");
            }

            User savedUser = userRepository.save(user);
            return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Registration successful!"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "status", "failed",
                "message", "Database write error: " + e.getMessage()
            ));
        }
    }

    // ⚡ FIXES THE 404 EXCEPTION ERROR BY HANDLING THE LOGIN POST ROUTE
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        User user = userRepository.findByEmail(email);

        // Validate if user exists and text passwords match
        if (user == null || !user.getPassword().equals(password)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                "status", "failed",
                "message", "Mismatched credentials or failed system authentication."
            ));
        }

        // Generate a random unique secure session mock token
        String secureToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." + UUID.randomUUID().toString();

        return ResponseEntity.ok(Map.of(
            "status", "success",
            "message", "Login verified!",
            "token", secureToken,
            "username", user.getName()
        ));
    }
}