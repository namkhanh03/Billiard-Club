package com.example.bidashop.model;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;

@Entity
@Table(name = "FacilityImage")
public class FacilityImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "facility_id", nullable = false)
    @JsonBackReference
    private Facility facility;

    public FacilityImage() {}

    public FacilityImage(String imageUrl, Facility facility) {
        this.imageUrl = imageUrl;
        this.facility = facility;
    }

    // Getters và Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Facility getFacility() { return facility; }
    public void setFacility(Facility facility) { this.facility = facility; }
}

