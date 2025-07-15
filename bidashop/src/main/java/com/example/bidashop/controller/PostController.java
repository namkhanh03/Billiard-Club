package com.example.bidashop.controller;

import com.example.bidashop.model.Post;
import com.example.bidashop.model.User;
import com.example.bidashop.service.PostService;
import com.example.bidashop.service.UserService;
import com.example.bidashop.utils.ApiResponse;
import com.example.bidashop.utils.PaginationResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private UserService userService;

    // ✅ Lấy danh sách bài viết với phân trang và tìm kiếm
    @GetMapping
    public ResponseEntity<ApiResponse<PaginationResponse<Post>>> getAllPosts(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String date) {
    
        // Convert the date string to LocalDate (strip time part)
        LocalDate dateFilter = null;
    
        if (date != null && !date.isEmpty()) {
            try {
                // Parse the date string to LocalDateTime (to handle time)
                LocalDateTime dateTime = LocalDateTime.parse(date, DateTimeFormatter.ISO_DATE_TIME);
                // Extract only the date part (ignore time)
                dateFilter = dateTime.toLocalDate();
            } catch (Exception e) {
                // Handle invalid date format
                System.err.println("Invalid date format: " + date);
                return ResponseEntity.badRequest().body(new ApiResponse<>(400, null, "Invalid date format"));
            }
        }
    
        // Log the received date to ensure it's parsed correctly
        System.out.println("Received date: " + dateFilter);
    
        // Pass the LocalDate to the service for filtering
        PaginationResponse<Post> posts = postService.getAllPosts(keyword, page, limit, dateFilter);
        return ResponseEntity.ok(new ApiResponse<>(200, posts, "Lấy danh sách bài viết thành công"));
    }

    // ✅ Lấy bài viết theo ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Post>> getPostById(@PathVariable Long id) {
        Optional<Post> post = postService.getPostById(id);
        return post.map(value -> ResponseEntity.ok(new ApiResponse<>(200, value, "Lấy bài viết thành công")))
                .orElseGet(
                        () -> ResponseEntity.status(404).body(new ApiResponse<>(404, null, "Không tìm thấy bài viết")));
    }

    // ✅ Thêm bài viết mới
    @PostMapping
    public ResponseEntity<ApiResponse<Post>> createPost(
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam("postedBy") Long postedById,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) {
        try {
            Optional<User> user = userService.getUserById(postedById);
            if (!user.isPresent()) {
                return ResponseEntity.status(404).body(new ApiResponse<>(404, null, "Người đăng bài không tồn tại"));
            }

            Post savedPost = postService.savePost(null, title, content, imageFile, postedById);
            return ResponseEntity.status(201).body(new ApiResponse<>(201, savedPost, "Thêm bài viết thành công"));
        } catch (IOException e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(500, null, "Lỗi tải ảnh: " + e.getMessage()));
        }
    }

    // ✅ Cập nhật bài viết
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Post>> updatePost(
            @PathVariable Long id,
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam("postedBy") Long postedById,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) {
        try {
            Optional<Post> existingPost = postService.getPostById(id);
            if (!existingPost.isPresent()) {
                return ResponseEntity.status(404).body(new ApiResponse<>(404, null, "Không tìm thấy bài viết"));
            }

            Post updatedPost = postService.savePost(id, title, content, imageFile, postedById);
            return ResponseEntity.ok(new ApiResponse<>(200, updatedPost, "Cập nhật bài viết thành công"));
        } catch (IOException e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(500, null, "Lỗi tải ảnh: " + e.getMessage()));
        }
    }

    // ✅ Xóa bài viết (soft delete)
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePost(@PathVariable Long id) {
        Optional<Post> existingPost = postService.getPostById(id);
        if (!existingPost.isPresent()) {
            return ResponseEntity.status(404).body(new ApiResponse<>(404, null, "Không tìm thấy bài viết"));
        }

        postService.deletePost(id);
        return ResponseEntity.ok(new ApiResponse<>(200, null, "Xóa bài viết thành công"));
    }
}
