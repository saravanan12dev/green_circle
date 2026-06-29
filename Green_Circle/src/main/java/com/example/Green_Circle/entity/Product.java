package com.example.Green_Circle.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    private String title;
    private String description;
    private String category;
    @Column(name = "price_per_day")
    private BigDecimal pricePerDay;
    @Column(name = "deposit_amount")
    private BigDecimal depositAmount;
    @Column(name = "image_url")
    private String imageUrl;
    private Double latitude;
    private Double longitude;
    @Column(name = "is_available")
    private Boolean isAvailable = true;
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}