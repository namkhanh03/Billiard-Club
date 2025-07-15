package com.example.bidashop.service;

import com.example.bidashop.model.Post;
import com.example.bidashop.model.User;
import com.example.bidashop.repository.PostRepository;
import com.example.bidashop.repository.UserRepository;
import com.example.bidashop.utils.FirebaseImageUploadService;
import com.example.bidashop.utils.PaginationResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FirebaseImageUploadService firebaseImageUploadService;

    // ✅ Lấy danh sách bài viết chưa bị xóa, có phân trang & tìm kiếm
    public PaginationResponse<Post> getAllPosts(String keyword, int page, int limit, LocalDate dateFilter) {
        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by("createdAt").descending());
        Page<Post> postPage;

        if (keyword != null && !keyword.trim().isEmpty()) {
            // Filter by keyword and date (only date part of createdAt)
            if (dateFilter != null) {
                postPage = postRepository.findByTitleContainingAndIsDeleteFalseAndCreatedAtDate(
                        keyword.trim(), dateFilter, pageable);
            } else {
                postPage = postRepository.findByTitleContainingAndIsDeleteFalse(keyword.trim(), pageable);
            }
        } else {
            // Filter only by date (ignoring time)
            if (dateFilter != null) {
                postPage = postRepository.findByIsDeleteFalseAndCreatedAtDate(dateFilter, pageable);
            } else {
                postPage = postRepository.findByIsDeleteFalse(pageable);
            }
        }

        // Return the response
        PaginationResponse<Post> response = new PaginationResponse<>();
        response.setContent(postPage.getContent());
        response.setPage(page);
        response.setLimit(limit);
        response.setTotalElements(postPage.getTotalElements());
        response.setTotalPages(postPage.getTotalPages());

        return response;
    }

    // ✅ Lấy bài viết theo ID
    public Optional<Post> getPostById(Long postId) {
        return postRepository.findById(postId).filter(post -> !post.getIsDelete());
    }

    // ✅ Thêm mới hoặc cập nhật bài viết
    public Post savePost(Long id, String title, String content, MultipartFile imageFile, Long postedById)
            throws IOException {
        Post post = id != null ? postRepository.findById(id).orElse(new Post()) : new Post();

        post.setTitle(title);
        post.setContent(content);

        // Kiểm tra User (người đăng bài)
        Optional<User> user = userRepository.findById(postedById);
        if (user.isPresent()) {
            post.setPostedBy(user.get());
        } else {
            throw new RuntimeException("Người đăng bài không tồn tại");
        }

        // Nếu có ảnh mới, tải lên Firebase
        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = firebaseImageUploadService.uploadImage(imageFile);
            post.setImage(imageUrl);
        }

        // Cập nhật thời gian tạo và chỉnh sửa
        if (post.getCreatedAt() == null) {
            post.setCreatedAt(LocalDateTime.now());
        }
        post.setUpdatedAt(LocalDateTime.now());

        return postRepository.save(post);
    }

    // ✅ Xóa bài viết (soft delete)
    public void deletePost(Long postId) {
        Optional<Post> post = postRepository.findById(postId);
        post.ifPresent(p -> {
            p.setIsDelete(true);
            postRepository.save(p);
        });
    }
}
