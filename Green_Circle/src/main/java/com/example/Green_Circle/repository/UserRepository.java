package com.example.Green_Circle.repository;

import com.example.Green_Circle.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Allows us to look up users by email during login later
    User findByEmail(String email);
}