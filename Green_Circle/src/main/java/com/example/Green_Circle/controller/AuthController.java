package com.example.Green_Circle.controller;

import com.example.Green_Circle.entity.User;
import com.example.Green_Circle.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;
import org.springframework.dao.DataIntegrityViolationException;

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
            // Check if account already exists (email or phone)
            if (userRepository.findByEmail(user.getEmail()) != null) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                    "status", "failed",
                    "message", "Email address is already registered!"
                ));
            }

            if (user.getPhone() != null && userRepository.findByPhone(user.getPhone()) != null) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                    "status", "failed",
                    "message", "Phone number is already registered!"
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
                "message", "Registration successful!",
                "id", savedUser.getId(),
                "name", savedUser.getName(),
                "email", savedUser.getEmail(),
                "phone", savedUser.getPhone()
            ));
        } catch (DataIntegrityViolationException dive) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                "status", "failed",
                "message", "Database write error: duplicate value for a unique field (email or phone)."
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
        String identifier = credentials.get("email");
        String password = credentials.get("password");

        User user = userRepository.findByEmail(identifier);
        if (user == null) {
            user = userRepository.findByPhone(identifier);
        }

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                "status", "failed",
                "message", "No user account found for that email or phone number."
            ));
        }

        if (!user.getPassword().equals(password)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                "status", "failed",
                "message", "Incorrect password."
            ));
        }

        // Generate a random unique secure session mock token
        String secureToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." + UUID.randomUUID().toString();

        return ResponseEntity.ok(Map.of(
            "status", "success",
            "message", "Login verified!",
            "token", secureToken,
            "id", user.getId(),
            "username", user.getName(),
            "name", user.getName(),
            "email", user.getEmail(),
            "phone", user.getPhone()
        ));
    }
}