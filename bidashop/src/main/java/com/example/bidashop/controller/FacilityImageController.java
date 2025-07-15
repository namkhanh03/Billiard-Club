package com.example.bidashop.controller;

import com.example.bidashop.model.FacilityImage;
import com.example.bidashop.repository.FacilityImageRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/facility-images")
public class FacilityImageController {

    @Autowired
    private FacilityImageRepository facilityImageRepository;

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<String> deleteFacilityImage(@PathVariable Long id) {
        try {
            // Find the FacilityImage by ID
            FacilityImage facilityImage = facilityImageRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Image not found with id: " + id));


            // Remove the image from the database
            facilityImageRepository.delete(facilityImage);

            return ResponseEntity.ok("Image deleted successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting image: " + e.getMessage());
        }
    }
}
