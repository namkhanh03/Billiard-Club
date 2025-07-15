package com.example.bidashop.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;

@Entity
@Table(name = "BilliardTable")
public class BilliardTable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String status;
    private Boolean isDelete = false;
    private Boolean isActive = true;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "facilityId", referencedColumnName = "id")
    @JsonManagedReference
    private Facility facility;

    @ManyToOne // Thêm quan hệ với Pricing, mỗi bàn có thể có 1 bảng giá hiện tại
    @JoinColumn(name = "pricing_id", referencedColumnName = "id")
    private Pricing pricing;  // Pricing cho bàn hiện tại

    public BilliardTable() {
    }

    public BilliardTable(Long id, String name, String status, Boolean isDelete, Boolean isActive,
                         LocalDateTime createdAt, LocalDateTime updatedAt, Facility facility, Pricing pricing) {
        this.id = id;
        this.name = name;
        this.status = status;
        this.isDelete = isDelete;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.facility = facility;
        this.pricing = pricing;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Boolean getIsDelete() {
        return isDelete;
    }

    public void setIsDelete(Boolean isDelete) {
        this.isDelete = isDelete;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
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

    public Facility getFacility() {
        return facility;
    }

    public void setFacility(Facility facility) {
        this.facility = facility;
    }

    public Pricing getPricing() {
        return pricing;
    }

    public void setPricing(Pricing pricing) {
        this.pricing = pricing;
    }
}
