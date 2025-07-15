package com.example.bidashop.service;

import com.example.bidashop.model.Pricing;
import com.example.bidashop.model.PricingDetail;
import com.example.bidashop.repository.PricingRepository;
import com.example.bidashop.utils.PaginationResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class PricingService {

    @Autowired
    private PricingRepository pricingRepository;

    // **Lấy tất cả bảng giá với phân trang & tìm kiếm**
    public PaginationResponse<Pricing> getAllPricings(String description, int page, int limit) {
        Pageable pageable = PageRequest.of(page - 1, limit);
        Page<Pricing> pricingPage;

        if (description != null && !description.isEmpty()) {
            pricingPage = pricingRepository.findByDescriptionContainingIgnoreCase(description, pageable);
        } else {
            pricingPage = pricingRepository.findAll(pageable);
        }

        PaginationResponse<Pricing> response = new PaginationResponse<>();
        response.setContent(pricingPage.getContent());
        response.setPage(page);
        response.setLimit(limit);
        response.setTotalElements(pricingPage.getTotalElements());
        response.setTotalPages(pricingPage.getTotalPages());

        return response;
    }

    // **Lấy bảng giá theo ID**
    public Optional<Pricing> getPricingById(Long id) {
        return pricingRepository.findById(id);
    }

    // **Tạo bảng giá mới**
    public Pricing createPricing(Pricing pricing) {
        pricing.setCreatedAt(LocalDateTime.now());
        pricing.setUpdatedAt(LocalDateTime.now());

        if (pricing.getPricingDetails() != null) {
            for (PricingDetail detail : pricing.getPricingDetails()) {
                detail.setPricing(pricing); // ✅ Gán lại quan hệ ngược
            }
        }

        return pricingRepository.save(pricing);
    }

    // **Cập nhật bảng giá**
    public Pricing updatePricing(Long id, Pricing pricingRequest) {
        Optional<Pricing> existingPricing = pricingRepository.findById(id);
        if (existingPricing.isPresent()) {
            Pricing pricing = existingPricing.get();

            // Cập nhật mô tả
            pricing.setDescription(pricingRequest.getDescription());

            // Cập nhật thời gian
            pricing.setUpdatedAt(LocalDateTime.now());

            // Xóa hết các PricingDetail cũ
            pricing.getPricingDetails().clear();

            // Thêm các PricingDetail mới vào
            for (PricingDetail detail : pricingRequest.getPricingDetails()) {
                // Gán lại mỗi PricingDetail cho Pricing
                detail.setPricing(pricing);
                pricing.getPricingDetails().add(detail); // Thêm PricingDetail vào Pricing
            }

            // Lưu lại Pricing mới cùng với PricingDetail mới
            return pricingRepository.save(pricing);
        }
        return null;
    }

    // **Xóa bảng giá**
    public void deletePricing(Long id) {
        pricingRepository.deleteById(id);
    }
}
