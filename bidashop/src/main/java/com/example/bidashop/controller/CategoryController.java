package com.example.bidashop.controller;

import com.example.bidashop.model.Category;
import com.example.bidashop.repository.CategoryRepository;
import com.example.bidashop.service.CategoryService;
import com.example.bidashop.utils.ApiResponse;
import com.example.bidashop.utils.PaginationResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private CategoryRepository categoryRepository;

    // Lấy tất cả các danh mục với phân trang, tìm kiếm và sắp xếp
    @GetMapping
    public ResponseEntity<ApiResponse<PaginationResponse<Category>>> getAllCategories(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "1") int page, // Chỉnh về page 1
            @RequestParam(defaultValue = "10") int limit) { // Đổi từ size thành limit
        PaginationResponse<Category> categories = categoryService.getAllCategories(keyword, page, limit);
        ApiResponse<PaginationResponse<Category>> response = new ApiResponse<>(200, categories,
                "Lấy danh mục thành công");
        return ResponseEntity.ok(response);
    }

    // Lấy danh mục theo ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Category>> getCategoryById(@PathVariable Long id) {
        Optional<Category> category = categoryService.getCategoryById(id);
        return category.map(cat -> {
            ApiResponse<Category> response = new ApiResponse<>(200, cat, "Lấy danh mục thành công");
            return ResponseEntity.ok(response);
        }).orElseGet(() -> {
            ApiResponse<Category> response = new ApiResponse<>(404, null, "Không tìm thấy danh mục");
            return ResponseEntity.status(404).body(response);
        });
    }

    // Thêm danh mục mới và tải ảnh lên
    @PostMapping
    public ResponseEntity<ApiResponse<Category>> createCategory(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestPart("image") MultipartFile imageFile) {
        try {
            // Kiểm tra tên danh mục đã tồn tại chưa
            if (categoryRepository.findByName(name).isPresent()) {
                return ResponseEntity.status(400).body(new ApiResponse<>(400, null, "Tên danh mục đã tồn tại!"));
            }

            // Tạo đối tượng Category mới
            Category category = new Category();
            category.setName(name);
            category.setDescription(description);
            category.setIsDelete(false); // Mặc định isDelete là false

            // Lưu danh mục và ảnh
            Category savedCategory = categoryService.saveCategory(category, imageFile);
            return ResponseEntity.status(201).body(new ApiResponse<>(201, savedCategory, "Tạo danh mục thành công"));

        } catch (IOException e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(500, null, "Lỗi tải ảnh: " + e.getMessage()));
        }
    }

    // Cập nhật danh mục
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Category>> updateCategory(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) {
        try {
            Optional<Category> categoryOptional = categoryService.getCategoryById(id);
            if (categoryOptional.isEmpty()) {
                return ResponseEntity.status(404).body(new ApiResponse<>(404, null, "Không tìm thấy danh mục"));
            }

            Category category = categoryOptional.get();

            // Kiểm tra nếu tên mới trùng với danh mục khác
            Optional<Category> existingCategory = categoryRepository.findByName(name);
            if (existingCategory.isPresent() && !existingCategory.get().getId().equals(id)) {
                return ResponseEntity.status(400).body(new ApiResponse<>(400, null, "Tên danh mục đã tồn tại!"));
            }

            category.setName(name);
            category.setDescription(description);

            // Lưu cập nhật danh mục và (nếu có) cập nhật ảnh
            Category savedCategory = categoryService.saveCategory(category, imageFile);
            return ResponseEntity.ok(new ApiResponse<>(200, savedCategory, "Cập nhật danh mục thành công"));

        } catch (IOException e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(500, null, "Lỗi tải ảnh: " + e.getMessage()));
        }
    }

    // Xóa danh mục (Chuyển isDelete thành true)
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Long id) {
        Optional<Category> categoryOptional = categoryService.getCategoryById(id);
        if (categoryOptional.isPresent()) {
            categoryService.deleteCategory(id);
            ApiResponse<Void> response = new ApiResponse<>(200, null, "Xóa danh mục thành công");
            return ResponseEntity.ok(response);
        } else {
            ApiResponse<Void> response = new ApiResponse<>(404, null, "Không tìm thấy danh mục");
            return ResponseEntity.status(404).body(response);
        }
    }
}
