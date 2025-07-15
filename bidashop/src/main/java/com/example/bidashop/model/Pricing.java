package com.example.bidashop.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "Pricing")
public class Pricing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description; // Mô tả bảng giá, ví dụ: "Bảng giá ngày thường"

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Mỗi Pricing có nhiều PricingDetail (mỗi khung giờ và giá)
    @OneToMany(mappedBy = "pricing", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PricingDetail> pricingDetails;

    public Pricing() {
    }

    public Pricing(Long id, String description, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.description = description;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public List<PricingDetail> getPricingDetails() {
        return pricingDetails;
    }

    public void setPricingDetails(List<PricingDetail> pricingDetails) {
        this.pricingDetails = pricingDetails;
    }
}
