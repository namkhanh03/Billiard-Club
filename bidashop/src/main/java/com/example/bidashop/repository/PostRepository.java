package com.example.bidashop.repository;

import com.example.bidashop.model.Post;

import java.time.LocalDate;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PostRepository extends JpaRepository<Post, Long> {
    // ✅ Lọc bài viết theo tiêu đề và chưa bị xóa mềm
    Page<Post> findByTitleContainingAndIsDeleteFalse(String keyword, Pageable pageable);

    // ✅ Lọc tất cả bài viết chưa bị xóa mềm
    Page<Post> findByIsDeleteFalse(Pageable pageable);

     @Query("SELECT p FROM Post p WHERE p.isDelete = false AND p.title LIKE %:keyword% AND FUNCTION('DATE', p.createdAt) = :dateFilter")
    Page<Post> findByTitleContainingAndIsDeleteFalseAndCreatedAtDate(String keyword, LocalDate dateFilter, Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.isDelete = false AND FUNCTION('DATE', p.createdAt) = :dateFilter")
    Page<Post> findByIsDeleteFalseAndCreatedAtDate(LocalDate dateFilter, Pageable pageable);
}
