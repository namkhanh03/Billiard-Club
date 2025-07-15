package com.example.bidashop.model;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
@Table(name = "Category")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String image;
    private Boolean isDelete = false;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Category() {
    }

    public Category(Long id, String name, String image, Boolean isDelete, String description, LocalDateTime createdAt,
            LocalDateTime updatedAt, List<DrinkFood> drinkFoods) {
        this.id = id;
        this.name = name;
        this.image = image;
        this.isDelete = isDelete;
        this.description = description;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.drinkFoods = drinkFoods;
    }

    @OneToMany(mappedBy = "category")
    @JsonIgnore
    private List<DrinkFood> drinkFoods;

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

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
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

    public List<DrinkFood> getDrinkFoods() {
        return drinkFoods;
    }

    public void setDrinkFoods(List<DrinkFood> drinkFoods) {
        this.drinkFoods = drinkFoods;
    }

}
