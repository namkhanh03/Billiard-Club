package com.example.bidashop.model;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;

@Entity
@Table(name = "OrderDetail")
public class OrderDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "order_id")
    @JsonBackReference
    private Order order;

    @ManyToOne
    private DrinkFood drink;

    private Integer quantity;
    private Integer unitPrice;

    public OrderDetail() {
    }

    public OrderDetail(Long id, Order order, DrinkFood drink, Integer quantity, Integer unitPrice) {
        this.id = id;
        this.order = order;
        this.drink = drink;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public DrinkFood getDrink() {
        return drink;
    }

    public void setDrink(DrinkFood drink) {
        this.drink = drink;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Integer getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(Integer unitPrice) {
        this.unitPrice = unitPrice;
    }

    // Getters and Setters
}
