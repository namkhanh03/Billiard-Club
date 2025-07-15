package com.example.bidashop.model;

import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "Post")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String content;

    private String image;
    private Boolean isDelete = false;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Post() {
    }

    public Post(Long id, String title, String content, String image, Boolean isDelete, LocalDateTime createdAt,
            LocalDateTime updatedAt,
            User postedBy) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.image = image;
        this.isDelete = isDelete;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.postedBy = postedBy;
    }

    @ManyToOne
    @JoinColumn(name = "postedBy", referencedColumnName = "userId")
    private User postedBy;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
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

    public User getPostedBy() {
        return postedBy;
    }

    public void setPostedBy(User postedBy) {
        this.postedBy = postedBy;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public Boolean getIsDelete() {
        return isDelete;
    }

    public void setIsDelete(Boolean isDelete) {
        this.isDelete = isDelete;
    }

}
