package com.example.Green_Circle.controller;

import com.example.Green_Circle.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/home")
@CrossOrigin(origins = "*")
public class HomeController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping("/explore")
    public ResponseEntity<List<Map<String, Object>>> getHyperlocalDiscoveryHub(
            @RequestParam Double lat,
            @RequestParam Double lon,
            @RequestParam(defaultValue = "5.0") Double radius) {
        
        List<Object[]> queryResults = productRepository.findHyperlocalProducts(lat, lon, radius);
        List<Map<String, Object>> records = new ArrayList<>();

        for (Object[] row : queryResults) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", row[0]);
            map.put("title", row[2]);
            map.put("description", row[3]);
            map.put("category", row[4]);
            map.put("pricePerDay", row[5]);
            map.put("depositAmount", row[6]);
            map.put("imageUrl", row[7]);
            map.put("distance", row[11]); 
            records.add(map);
        }
        return ResponseEntity.ok(records);
    }
}