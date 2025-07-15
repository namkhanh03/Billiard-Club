package com.example.bidashop.controller;

import com.example.bidashop.model.Pricing;
import com.example.bidashop.service.PricingService;
import com.example.bidashop.utils.ApiResponse;
import com.example.bidashop.utils.PaginationResponse;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pricings")
public class PricingController {

    @Autowired
    private PricingService pricingService;

    // **Lấy danh sách bảng giá với phân trang & tìm kiếm**
    @GetMapping
    public ResponseEntity<ApiResponse<PaginationResponse<Pricing>>> getAllPricings(
            @RequestParam(required = false) String description, // Tìm kiếm theo description
            @RequestParam(defaultValue = "1") int page, // Default page is 1
            @RequestParam(defaultValue = "10") int limit) { // Default limit is 10

        PaginationResponse<Pricing> pricings = pricingService.getAllPricings(description, page, limit);
        ApiResponse<PaginationResponse<Pricing>> response = new ApiResponse<>(200, pricings,
                "Lấy danh sách bảng giá thành công");

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Pricing>> createPricing(@RequestBody Pricing pricingRequest) {
        System.out.println("Received pricing request: " + pricingRequest); // Log request
        try {
            Pricing savedPricing = pricingService.createPricing(pricingRequest);
            return ResponseEntity.status(201)
                    .body(new ApiResponse<>(201, savedPricing, "Tạo bảng giá thành công"));
        } catch (DataIntegrityViolationException e) {
            // This is where you handle the unique constraint violation
            return ResponseEntity.status(400)
                    .body(new ApiResponse<>(400, null, "Bảng giá với mô tả này đã tồn tại"));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(new ApiResponse<>(500, null, "Lỗi khi tạo bảng giá: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Pricing>> updatePricing(@PathVariable Long id,
            @RequestBody Pricing pricingRequest) {
        try {
            Optional<Pricing> existingPricing = pricingService.getPricingById(id);
            if (!existingPricing.isPresent()) {
                return ResponseEntity.status(404)
                        .body(new ApiResponse<>(404, null, "Không tìm thấy bảng giá để cập nhật"));
            }

            Pricing updatedPricing = pricingService.updatePricing(id, pricingRequest);
            return ResponseEntity.ok(new ApiResponse<>(200, updatedPricing, "Cập nhật bảng giá thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(new ApiResponse<>(500, null, "Lỗi khi cập nhật bảng giá: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePricing(@PathVariable Long id) {
        Optional<Pricing> existingPricing = pricingService.getPricingById(id);
        if (!existingPricing.isPresent()) {
            return ResponseEntity.status(404).body(new ApiResponse<>(404, null, "Không tìm thấy bảng giá để xóa"));
        }

        pricingService.deletePricing(id);
        return ResponseEntity.ok(new ApiResponse<>(200, null, "Xóa bảng giá thành công"));
    }

}
