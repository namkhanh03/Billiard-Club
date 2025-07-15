package com.example.bidashop.model;

import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "Reservation")
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime reservationTime;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "booking_by", referencedColumnName = "userId") // OK
    private User bookingBy;

    @ManyToOne
    @JoinColumn(name = "facilityId", referencedColumnName = "id")
    private Facility facility;

    public Reservation() {}

    public Reservation(Long id, LocalDateTime reservationTime, String status,
                       LocalDateTime createdAt, LocalDateTime updatedAt,
                       User bookingBy, Facility facility) {
        this.id = id;
        this.reservationTime = reservationTime;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.bookingBy = bookingBy;
        this.facility = facility;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getReservationTime() {
        return reservationTime;
    }

    public void setReservationTime(LocalDateTime reservationTime) {
        this.reservationTime = reservationTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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

    public User getBookingBy() {
        return bookingBy;
    }

    public void setBookingBy(User bookingBy) {
        this.bookingBy = bookingBy;
    }
}
