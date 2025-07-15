package com.example.bidashop.utils;

public class ApiResponse<T> {

    private int statusCode;
    private T payload;
    private String message;
    private boolean success;

    // Constructor
    public ApiResponse(int statusCode, T payload, String message) {
        this.statusCode = statusCode;
        this.payload = payload;
        this.message = message;
        this.success = statusCode < 400; // success là true nếu statusCode nhỏ hơn 400
    }

    // Getters và Setters
    public int getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(int statusCode) {
        this.statusCode = statusCode;
    }

    public T getPayload() {
        return payload;
    }

    public void setPayload(T payload) {
        this.payload = payload;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }
}
