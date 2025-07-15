// dto/TempTableSessionRequestDTO.java
package com.example.bidashop.dto;

import java.time.LocalDateTime;
import java.util.List;

public class TempTableSessionRequestDTO {
    private Long tableId;
    private Long customerId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String customerPhone;
    private String status;
    private List<DrinkItemDTO> drinks;

    public static class DrinkItemDTO {
        private Long drinkId;
        private Integer quantity;
        private Integer unitPrice;

        public Long getDrinkId() {
            return drinkId;
        }

        public void setDrinkId(Long drinkId) {
            this.drinkId = drinkId;
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
    }

    // Getters & Setters
    public Long getTableId() {
        return tableId;
    }

    public void setTableId(Long tableId) {
        this.tableId = tableId;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
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

    public List<DrinkItemDTO> getDrinks() {
        return drinks;
    }

    public void setDrinks(List<DrinkItemDTO> drinks) {
        this.drinks = drinks;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }
    
}
