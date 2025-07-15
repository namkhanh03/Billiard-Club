package com.example.bidashop.dto;

public class OrderRequestDTO {
    private Long sessionId;
    private String paymentMethod;
    private String customerPhone;
    private Integer requestTotalAmount; // Tổng tiền yêu cầu
    private Long playDuration; // Thời gian chơi (phút)
    private Long staffId; // ID của nhân viên thanh toán

    // Getters and Setters
    public Long getSessionId() {
        return sessionId;
    }

    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public Long getPlayDuration() {
        return playDuration;
    }

    public void setPlayDuration(Long playDuration) {
        this.playDuration = playDuration;
    }

    public Integer getRequestTotalAmount() {
        return requestTotalAmount;
    }

    public void setRequestTotalAmount(Integer requestTotalAmount) {
        this.requestTotalAmount = requestTotalAmount;
    }

    public Long getStaffId() {
        return staffId;
    }

    public void setStaffId(Long staffId) {
        this.staffId = staffId;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }
}
