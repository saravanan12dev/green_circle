package com.example.Green_Circle.service;

import com.example.Green_Circle.entity.Rental;
import com.example.Green_Circle.entity.User;
import com.example.Green_Circle.repository.RentalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DisputeEngineService {

    @Autowired
    private RentalRepository rentalRepository;

    @Transactional
    public void executeInstantLockdown(Long rentalId) {
        Rental rental = rentalRepository.findById(rentalId)
                .orElseThrow(() -> new RuntimeException("Target transaction context missing."));
        
        User renter = rental.getRenter();
        renter.setTrustFactorStatus("BANNED_LOCKDOWN");
        
        rental.setStatus(Rental.RentalStatus.BANNED_LOCKDOWN);
        rentalRepository.save(rental);
    }
}