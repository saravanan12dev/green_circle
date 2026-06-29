package com.example.Green_Circle.controller;

import com.example.Green_Circle.entity.Rental;
import com.example.Green_Circle.service.OtpHandoverService;
import com.example.Green_Circle.repository.RentalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/rentals")
@CrossOrigin(origins = "*")
public class RentalController {

    @Autowired
    private OtpHandoverService otpHandoverService;

    @Autowired
    private RentalRepository rentalRepository;

    @PostMapping("/{id}/generate-otp")
    public ResponseEntity<String> requestHandoffOtp(@PathVariable Long id) {
        String token = otpHandoverService.generateSecureHandoverOtp(id);
        return ResponseEntity.ok(token);
    }

    @PostMapping("/verify-handshake")
    public ResponseEntity<String> verifyPasscode(@RequestParam String otp) {
        Rental updatedLease = otpHandoverService.verifyHandshakePasscode(otp);
        return ResponseEntity.ok("Verification complete. State shifted to: " + updatedLease.getStatus().name());
    }

    @GetMapping
    public ResponseEntity<List<Rental>> getRentals() {
        return ResponseEntity.ok(rentalRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRental(@PathVariable Long id) {
        try {
            Rental rental = rentalRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Rental not found"));
            return ResponseEntity.ok(rental);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("status", "error", "message", "Rental not found"));
        }
    }

    @PostMapping
    public ResponseEntity<?> createRental(@RequestBody Rental rentalData) {
        try {
            rentalData.setStatus(Rental.RentalStatus.REQUESTED);
            Rental savedRental = rentalRepository.save(rentalData);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of(
                        "status", "success",
                        "message", "Rental created successfully",
                        "rentalId", savedRental.getId()
                    ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("status", "error", "message", "Failed to create rental: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRental(@PathVariable Long id, @RequestBody Rental rentalData) {
        try {
            Rental existingRental = rentalRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Rental not found"));

            if (rentalData.getStartDate() != null) {
                existingRental.setStartDate(rentalData.getStartDate());
            }
            if (rentalData.getEndDate() != null) {
                existingRental.setEndDate(rentalData.getEndDate());
            }
            if (rentalData.getTotalDays() != null) {
                existingRental.setTotalDays(rentalData.getTotalDays());
            }
            if (rentalData.getRentalFee() != null) {
                existingRental.setRentalFee(rentalData.getRentalFee());
            }
            if (rentalData.getSecurityDeposit() != null) {
                existingRental.setSecurityDeposit(rentalData.getSecurityDeposit());
            }
            if (rentalData.getTotalEscrowAmount() != null) {
                existingRental.setTotalEscrowAmount(rentalData.getTotalEscrowAmount());
            }
            if (rentalData.getStatus() != null) {
                existingRental.setStatus(rentalData.getStatus());
            }

            Rental updatedRental = rentalRepository.save(existingRental);
            return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Rental updated successfully",
                "rentalId", updatedRental.getId()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("status", "error", "message", "Failed to update rental: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRental(@PathVariable Long id) {
        try {
            Rental rental = rentalRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Rental not found"));
            rentalRepository.delete(rental);
            return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Rental deleted successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("status", "error", "message", "Failed to delete rental"));
        }
    }
}
