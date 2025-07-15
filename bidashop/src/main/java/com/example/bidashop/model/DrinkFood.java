package com.example.bidashop.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;

@Entity
@Table(name = "DrinkFood")
public class DrinkFood {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private Double price;
    private String image;
    private Boolean isActive = true;
    private Boolean isDelete = false;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private Integer quantity; // ✅ Số lượng hiện tại
    private Integer warningThreshold; // ✅ Mức cảnh báo khi số lượng <= giá trị này

    @ManyToOne
    @JoinColumn(name = "categoryId", referencedColumnName = "id")
    @JsonManagedReference
    private Category category;

    @ManyToOne
    @JoinColumn(name = "facilityId", referencedColumnName = "id") // ✅ Gắn món với chi nhánh
    @JsonManagedReference
    private Facility facility;

    public DrinkFood() {
    }

    public DrinkFood(Long id, String name, Double price, String image, Boolean isActive, Boolean isDelete,
            String description, LocalDateTime createdAt, LocalDateTime updatedAt,
            Integer quantity, Integer warningThreshold, Category category, Facility facility) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.image = image;
        this.isActive = isActive;
        this.isDelete = isDelete;
        this.description = description;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.quantity = quantity;
        this.warningThreshold = warningThreshold;
        this.category = category;
        this.facility = facility;
    }

    // --- Getters và Setters ---
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

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public Boolean getIsDelete() {
        return isDelete;
    }

    public void setIsDelete(Boolean isDelete) {
        this.isDelete = isDelete;
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

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Integer getWarningThreshold() {
        return warningThreshold;
    }

    public void setWarningThreshold(Integer warningThreshold) {
        this.warningThreshold = warningThreshold;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public Facility getFacility() {
        return facility;
    }

    public void setFacility(Facility facility) {
        this.facility = facility;
    }
}
