package com.example.Green_Circle.controller;

import com.example.Green_Circle.entity.Product;
import com.example.Green_Circle.entity.User;
import com.example.Green_Circle.repository.ProductRepository;
import com.example.Green_Circle.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProduct(@PathVariable Long id) {
        try {
            Product product = productRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Product not found"));
            return ResponseEntity.ok(product);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("status", "error", "message", "Product not found"));
        }
    }

   @PostMapping
    public ResponseEntity<?> createProduct(@RequestBody Product product) {
        try {
            Long ownerId = null;
            if (product.getOwner() != null && product.getOwner().getId() != null) {
                ownerId = product.getOwner().getId();
            } else if (product.getOwnerId() != null) {
                ownerId = product.getOwnerId();
            }

            if (ownerId != null) {
                User owner = userRepository.findById(ownerId)
                        .orElseThrow(() -> new RuntimeException("Owner not found with ID: " + ownerId));
                product.setOwner(owner);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("status", "error", "message", "User/Owner ID is required to post a product."));
            }

            Product savedProduct = productRepository.save(product);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of(
                            "status", "success",
                            "message", "Product created successfully",
                            "productId", savedProduct.getId()
                    ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("status", "error", "message", "Failed to create product: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody Product productData) {
        try {
            Product existingProduct = productRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            if (productData.getTitle() != null) {
                existingProduct.setTitle(productData.getTitle());
            }
            if (productData.getDescription() != null) {
                existingProduct.setDescription(productData.getDescription());
            }
            if (productData.getCategory() != null) {
                existingProduct.setCategory(productData.getCategory());
            }
            if (productData.getPricePerDay() != null) {
                existingProduct.setPricePerDay(productData.getPricePerDay());
            }
            if (productData.getDepositAmount() != null) {
                existingProduct.setDepositAmount(productData.getDepositAmount());
            }
            if (productData.getImageUrl() != null) {
                existingProduct.setImageUrl(productData.getImageUrl());
            }
            if (productData.getIsAvailable() != null) {
                existingProduct.setIsAvailable(productData.getIsAvailable());
            }

            Product updatedProduct = productRepository.save(existingProduct);
            return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Product updated successfully",
                "productId", updatedProduct.getId()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("status", "error", "message", "Failed to update product: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        try {
            Product product = productRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Product not found"));
            productRepository.delete(product);
            return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Product deleted successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("status", "error", "message", "Failed to delete product"));
        }
    }
}
