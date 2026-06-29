package com.example.Green_Circle.repository;

import com.example.Green_Circle.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query(value = "SELECT p.id, p.user_id, p.title, p.description, p.category, p.price_per_day, p.deposit_amount, p.image_url, p.latitude, p.longitude, p.is_available, " +
                   "(6371 * acos(cos(radians(:lat)) * cos(radians(p.latitude)) * cos(radians(p.longitude) - radians(:lon)) + sin(radians(:lat)) * sin(radians(p.latitude)))) AS distance " +
                   "FROM products p " +
                   "WHERE p.is_available = true AND " +
                   "(6371 * acos(cos(radians(:lat)) * cos(radians(p.latitude)) * cos(radians(p.longitude) - radians(:lon)) + sin(radians(:lat)) * sin(radians(p.latitude)))) <= :radius " +
                   "ORDER BY distance ASC", nativeQuery = true)
    List<Object[]> findHyperlocalProducts(@Param("lat") Double lat, @Param("lon") Double lon, @Param("radius") Double radius);
}