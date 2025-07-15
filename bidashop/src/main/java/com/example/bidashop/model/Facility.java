package com.example.bidashop.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;

@Entity
@Table(name = "Facility")
public class Facility {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String address;
    private String phoneNumber;
    private Boolean isDelete = false;
    private Boolean isActive = true;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "facility", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<FacilityImage> images = new ArrayList<>();

    @OneToMany(mappedBy = "facility")
    @JsonIgnore
    private List<BilliardTable> billiardTables;

    @OneToMany(mappedBy = "facility", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<FacilityUser> managers = new ArrayList<>();

    public List<FacilityUser> getManagers() {
        return managers;
    }

    public void setManagers(List<FacilityUser> managers) {
        this.managers = managers;
    }

    public Facility() {
    }

    public Facility(Long id, String name, String address, String phoneNumber, Boolean isDelete, Boolean isActive,
            LocalDateTime createdAt, LocalDateTime updatedAt, List<FacilityImage> images,
            List<BilliardTable> billiardTables) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.phoneNumber = phoneNumber;
        this.isDelete = isDelete;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.images = images;
        this.billiardTables = billiardTables;
    }

    // Getters và Setters
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

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
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

    public List<FacilityImage> getImages() {
        return images;
    }

    public void setImages(List<FacilityImage> images) {
        this.images.clear(); // ✅ Xóa từng phần tử thay vì thay toàn bộ danh sách
        if (images != null) {
            this.images.addAll(images);
        }
    }

    public List<BilliardTable> getBilliardTables() {
        return billiardTables;
    }

    public void setBilliardTables(List<BilliardTable> billiardTables) {
        this.billiardTables = billiardTables;
    }
}
