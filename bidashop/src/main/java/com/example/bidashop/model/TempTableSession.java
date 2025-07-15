// 1. TempTableSession.java
package com.example.bidashop.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "TempTableSession")
public class TempTableSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "table_id")
    private BilliardTable table;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private User customer;

    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String customerPhone;

    private String status; // ACTIVE, DONE, CANCELED

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TempDrinkItem> drinks;

    private Integer printCount = 0; // ✅ Thêm dòng này

    // Constructors
    public TempTableSession() {
    }

    public TempTableSession(Long id, BilliardTable table, User customer, String customerPhone, LocalDateTime startTime,
            LocalDateTime endTime,
            String status, List<TempDrinkItem> drinks, Integer printCount) {
        this.id = id;
        this.table = table;
        this.customer = customer;
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = status;
        this.drinks = drinks;
        this.printCount = printCount;
        this.customerPhone = customerPhone;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BilliardTable getTable() {
        return table;
    }

    public void setTable(BilliardTable table) {
        this.table = table;
    }

    public User getCustomer() {
        return customer;
    }

    public void setCustomer(User customer) {
        this.customer = customer;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<TempDrinkItem> getDrinks() {
        return drinks;
    }

    public void setDrinks(List<TempDrinkItem> drinks) {
        this.drinks = drinks;
    }

    public Integer getPrintCount() {
        return printCount;
    }

    public void setPrintCount(Integer printCount) {
        this.printCount = printCount;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }
    
}
