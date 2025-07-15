package com.example.bidashop.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
@Table(name = "TempDrinkItem")
public class TempDrinkItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "session_id")
    @JsonIgnore 
    private TempTableSession session;

    @ManyToOne
    @JoinColumn(name = "drink_id")
    private DrinkFood drink;

    private Integer quantity;
    private Integer priceAtThatTime;

    public TempDrinkItem() {
    }

    public TempDrinkItem(Long id, TempTableSession session, DrinkFood drink, Integer quantity,
            Integer priceAtThatTime) {
        this.id = id;
        this.session = session;
        this.drink = drink;
        this.quantity = quantity;
        this.priceAtThatTime = priceAtThatTime;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public TempTableSession getSession() {
        return session;
    }

    public void setSession(TempTableSession session) {
        this.session = session;
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

    public Integer getPriceAtThatTime() {
        return priceAtThatTime;
    }

    public void setPriceAtThatTime(Integer priceAtThatTime) {
        this.priceAtThatTime = priceAtThatTime;
    }

    // Getters and Setters
}