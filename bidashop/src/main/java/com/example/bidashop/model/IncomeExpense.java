package com.example.bidashop.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "IncomeExpense")
public class IncomeExpense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type; // Income or Expense
    private Double amount;
    private LocalDate date;
    private String description;
    private LocalDateTime createdAt;
    private Boolean isDelete = false;
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "createdBy", referencedColumnName = "userId")
    private User createdBy;

    @ManyToOne
    @JoinColumn(name = "facilityId", referencedColumnName = "id") // Liên kết với chi nhánh
    private Facility facility; // Facility mà hóa đơn này thuộc về

    // Thêm trường để lưu đường dẫn tài liệu
    @Column(name = "document_path")
    private String documentPath; // Đường dẫn của hóa đơn, phiếu chi, phiếu thu, hợp đồng hoặc hình ảnh liên quan

    // Constructors
    public IncomeExpense(Long id, String type, Double amount, LocalDate date, String description,
            LocalDateTime createdAt, LocalDateTime updatedAt, User createdBy, Facility facility, Boolean isDelete, String documentPath) {
        this.id = id;
        this.type = type;
        this.amount = amount;
        this.date = date;
        this.isDelete = isDelete;
        this.description = description;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.createdBy = createdBy;
        this.facility = facility;
        this.documentPath = documentPath; // Gán đường dẫn tài liệu
    }

    public IncomeExpense() {
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
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

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }

    public Facility getFacility() {
        return facility;
    }

    public void setFacility(Facility facility) {
        this.facility = facility;
    }

    public Boolean getIsDelete() {
        return isDelete;
    }

    public void setIsDelete(Boolean isDelete) {
        this.isDelete = isDelete;
    }

    public String getDocumentPath() {
        return documentPath;
    }

    public void setDocumentPath(String documentPath) {
        this.documentPath = documentPath;
    }
}
