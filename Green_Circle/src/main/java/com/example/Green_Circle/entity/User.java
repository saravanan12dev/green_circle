package com.example.Green_Circle.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @Column(unique = true)
    private String email;
    @Column(unique = true)
    private String phone;
    private String password;
    private String city;
    private String state;
    private Double latitude;
    private Double longitude;
    @Column(name = "trust_factor_status")
    private String trustFactorStatus;
    @Column(name = "profile_image")
    private String profileImage;
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}