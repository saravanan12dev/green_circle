package com.example.Green_Circle.service;

import com.example.Green_Circle.entity.Rental;
import com.example.Green_Circle.repository.RentalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;
import java.util.Random;

@Service
public class OtpHandoverService {

    @Autowired
    private RentalRepository rentalRepository;

    public String generateSecureHandoverOtp(Long rentalId) {
        Rental rental = rentalRepository.findById(rentalId)
                .orElseThrow(() -> new RuntimeException("Rental Node Not Found"));
        String secureOtp = String.format("%04d-SECURE", new Random().nextInt(10000));
        rental.setHandoffOtp(secureOtp);
        rental.setStatus(Rental.RentalStatus.OTP_GENERATED);
        rentalRepository.save(rental);
        return secureOtp;
    }

    @Transactional
    public Rental verifyHandshakePasscode(String otp) {
        Rental rental = rentalRepository.findByHandoffOtp(otp)
                .orElseThrow(() -> new RuntimeException("Invalid Secure Verification Handshake Passcode"));
        
        if (rental.getStatus() != Rental.RentalStatus.OTP_GENERATED) {
            throw new IllegalStateException("Handoff context invalid or already processed.");
        }

        rental.setStatus(Rental.RentalStatus.ACTIVE_LEASE);
        return rentalRepository.save(rental);
    }
}