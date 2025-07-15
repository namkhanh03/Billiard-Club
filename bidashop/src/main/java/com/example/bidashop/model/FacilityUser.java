package com.example.bidashop.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "FacilityUser")
public class FacilityUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonManagedReference
    private User user;

    @ManyToOne
    @JoinColumn(name = "facility_id", nullable = false)
    @JsonManagedReference
    private Facility facility;

    private LocalDateTime assignedAt = LocalDateTime.now(); // Thời gian được gán quản lý

    public FacilityUser() {}

    public FacilityUser(User user, Facility facility) {
        this.user = user;
        this.facility = facility;
        this.assignedAt = LocalDateTime.now();
    }

    // Getters và Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Facility getFacility() {
        return facility;
    }

    public void setFacility(Facility facility) {
        this.facility = facility;
    }

    public LocalDateTime getAssignedAt() {
        return assignedAt;
    }

    public void setAssignedAt(LocalDateTime assignedAt) {
        this.assignedAt = assignedAt;
    }
}
