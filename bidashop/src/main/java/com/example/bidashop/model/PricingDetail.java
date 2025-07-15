package com.example.bidashop.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
@Table(name = "PricingDetail")
public class PricingDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String timeSlot; // Ví dụ: "00:00 - 12:00"
    private Double price;    // Giá cho khung giờ này

    @ManyToOne
    @JoinColumn(name = "pricing_id") // Liên kết với Pricing
    @JsonIgnore
    private Pricing pricing;

    public PricingDetail() {}

    public PricingDetail(Long id, String timeSlot, Double price, Pricing pricing) {
        this.id = id;
        this.timeSlot = timeSlot;
        this.price = price;
        this.pricing = pricing;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getTimeSlot() {
        return timeSlot;
    }
    public void setTimeSlot(String timeSlot) {
        this.timeSlot = timeSlot;
    }

    public Double getPrice() {
        return price;
    }
    public void setPrice(Double price) {
        this.price = price;
    }

    public Pricing getPricing() {
        return pricing;
    }
    public void setPricing(Pricing pricing) {
        this.pricing = pricing;
    }
}
