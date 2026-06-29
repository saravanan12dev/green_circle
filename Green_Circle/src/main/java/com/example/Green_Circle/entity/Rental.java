package com.example.Green_Circle.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "rentals")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Rental {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne
    @JoinColumn(name = "renter_id", nullable = false)
    private User renter;

    private LocalDate startDate;
    private LocalDate endDate;
    private Integer totalDays;
    private BigDecimal rentalFee;
    private BigDecimal securityDeposit;
    private BigDecimal totalEscrowAmount;

    @Enumerated(EnumType.STRING)
    private RentalStatus status;

    private String handoffOtp;
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum RentalStatus {
        AVAILABLE, REQUESTED, APPROVED, OTP_GENERATED, ACTIVE_LEASE, COMPLETED, UNDER_DISPUTE, BANNED_LOCKDOWN
    }
}