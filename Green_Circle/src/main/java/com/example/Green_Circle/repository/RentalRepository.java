package com.example.Green_Circle.repository;

import com.example.Green_Circle.entity.Rental;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RentalRepository extends JpaRepository<Rental, Long> {
    Optional<Rental> findByHandoffOtp(String handoffOtp);
}