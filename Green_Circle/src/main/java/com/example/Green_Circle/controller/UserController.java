package com.example.Green_Circle.controller;

import com.example.Green_Circle.entity.User;
import com.example.Green_Circle.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserProfile(@PathVariable Long id) {
        try {
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("status", "error", "message", "User not found"));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader(value = "Authorization", required = false) String token) {
        try {
            // In a real implementation, extract user from JWT token
            // For now, return a placeholder response
            if (token == null || token.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("status", "error", "message", "No authentication token provided"));
            }
            return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Current user fetched from token"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("status", "error", "message", "Failed to fetch current user"));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUserProfile(@PathVariable Long id, @RequestBody User userData) {
        try {
            User existingUser = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (userData.getName() != null) {
                existingUser.setName(userData.getName());
            }
            if (userData.getPhone() != null) {
                existingUser.setPhone(userData.getPhone());
            }
            if (userData.getCity() != null) {
                existingUser.setCity(userData.getCity());
            }
            if (userData.getState() != null) {
                existingUser.setState(userData.getState());
            }
            if (userData.getLatitude() != null) {
                existingUser.setLatitude(userData.getLatitude());
            }
            if (userData.getLongitude() != null) {
                existingUser.setLongitude(userData.getLongitude());
            }
            if (userData.getTrustFactorStatus() != null) {
                existingUser.setTrustFactorStatus(userData.getTrustFactorStatus());
            }
            if (userData.getProfileImage() != null) {
                existingUser.setProfileImage(userData.getProfileImage());
            }

            User updatedUser = userRepository.save(existingUser);
            return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "User profile updated successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("status", "error", "message", "Failed to update user profile: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}/profile-image")
    public ResponseEntity<?> updateUserProfileImage(@PathVariable Long id, @RequestBody Map<String, String> requestBody) {
        try {
            User existingUser = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            String profileImage = requestBody.get("profileImage");
            if (profileImage != null) {
                existingUser.setProfileImage(profileImage);
            }

            User updatedUser = userRepository.save(existingUser);
            return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Profile image updated successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("status", "error", "message", "Failed to update profile image"));
        }
    }
}
