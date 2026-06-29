package com.example.Green_Circle.controller;

import com.example.Green_Circle.entity.Rental;
import com.example.Green_Circle.repository.RentalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private RentalRepository rentalRepository;

    @GetMapping
    public ResponseEntity<List<Rental>> getAllOrders() {
        return ResponseEntity.ok(rentalRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrder(@PathVariable Long id) {
        try {
            Rental rental = rentalRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Order not found"));
            return ResponseEntity.ok(rental);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("status", "error", "message", "Order not found"));
        }
    }

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody Rental rentalData) {
        try {
            rentalData.setStatus(Rental.RentalStatus.REQUESTED);
            Rental savedRental = rentalRepository.save(rentalData);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of(
                        "status", "success",
                        "message", "Order placed successfully",
                        "orderId", savedRental.getId()
                    ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("status", "error", "message", "Failed to place order: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateOrder(@PathVariable Long id, @RequestBody Rental rentalData) {
        try {
            Rental existingRental = rentalRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Order not found"));

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
                "message", "Order updated successfully",
                "orderId", updatedRental.getId()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("status", "error", "message", "Failed to update order: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable Long id) {
        try {
            Rental rental = rentalRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Order not found"));
            rentalRepository.delete(rental);
            return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Order deleted successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("status", "error", "message", "Failed to delete order"));
        }
    }
}
