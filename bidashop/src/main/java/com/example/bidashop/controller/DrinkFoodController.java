package com.example.bidashop.controller;

import com.example.bidashop.model.DrinkFood;
import com.example.bidashop.repository.DrinkFoodRepository;
import com.example.bidashop.service.DrinkFoodService;
import com.example.bidashop.utils.ApiResponse;
import com.example.bidashop.utils.PaginationResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@RestController
@RequestMapping("/api/drink-foods")
public class DrinkFoodController {

    @Autowired
    private DrinkFoodService drinkFoodService;

    @Autowired
    private DrinkFoodRepository drinkFoodRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<PaginationResponse<DrinkFood>>> getAllDrinkFoods(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long facilityId,
            @RequestParam(required = false) Long userId) { // ✅ thêm userId để lọc theo quyền quản lý
        PaginationResponse<DrinkFood> foods = drinkFoodService.getAllDrinkFoods(keyword, page, limit, categoryId,
                facilityId, userId);
        return ResponseEntity.ok(new ApiResponse<>(200, foods, "Lấy danh sách đồ uống/thức ăn thành công"));
    }

    // ✅ Lấy thông tin đồ uống/thức ăn theo ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DrinkFood>> getDrinkFoodById(@PathVariable Long id) {
        Optional<DrinkFood> food = drinkFoodService.getDrinkFoodById(id);
        return food.map(f -> ResponseEntity.ok(new ApiResponse<>(200, f, "Lấy thông tin thành công")))
                .orElseGet(
                        () -> ResponseEntity.status(404).body(new ApiResponse<>(404, null, "Không tìm thấy sản phẩm")));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<DrinkFood>> createDrinkFood(
            @RequestParam("name") String name,
            @RequestParam("price") Double price,
            @RequestParam("description") String description,
            @RequestParam("categoryId") Long categoryId,
            @RequestParam("facilityId") Long facilityId, // ✅
            @RequestParam("quantity") Integer quantity, // ✅
            @RequestParam("warningThreshold") Integer warningThreshold, // ✅
            @RequestPart("image") MultipartFile imageFile) {
        try {
            if (drinkFoodRepository.findByNameAndIsDeleteFalse(name).isPresent()) {
                return ResponseEntity.status(400).body(new ApiResponse<>(400, null, "Tên sản phẩm đã tồn tại!"));
            }

            DrinkFood savedFood = drinkFoodService.saveDrinkFood(null, name, price, description, categoryId, facilityId,
                    quantity, warningThreshold, imageFile);
            return ResponseEntity.status(201).body(new ApiResponse<>(201, savedFood, "Thêm mới thành công"));
        } catch (IOException e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(500, null, "Lỗi tải ảnh: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<DrinkFood>> updateDrinkFood(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam("price") Double price,
            @RequestParam("description") String description,
            @RequestParam("categoryId") Long categoryId,
            @RequestParam("facilityId") Long facilityId, // ✅
            @RequestParam("quantity") Integer quantity, // ✅
            @RequestParam("warningThreshold") Integer warningThreshold, // ✅
            @RequestPart(value = "image", required = false) MultipartFile imageFile) {
        try {
            Optional<DrinkFood> existingFood = drinkFoodService.getDrinkFoodById(id);
            if (!existingFood.isPresent()) {
                return ResponseEntity.status(404).body(new ApiResponse<>(404, null, "Không tìm thấy sản phẩm"));
            }
            Optional<DrinkFood> foodWithSameName = drinkFoodRepository.findByName(name);
            if (foodWithSameName.isPresent() && !foodWithSameName.get().getId().equals(id)) {
                return ResponseEntity.status(400).body(new ApiResponse<>(400, null, "Tên sản phẩm đã tồn tại!"));
            }
            DrinkFood updatedFood = drinkFoodService.saveDrinkFood(id, name, price, description, categoryId, facilityId,
                    quantity, warningThreshold, imageFile);
            return ResponseEntity.ok(new ApiResponse<>(200, updatedFood, "Cập nhật thành công"));
        } catch (IOException e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(500, null, "Lỗi tải ảnh: " + e.getMessage()));
        }
    }

    // ✅ Xóa đồ uống/thức ăn (soft delete)
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteDrinkFood(@PathVariable Long id) {
        Optional<DrinkFood> existingFood = drinkFoodService.getDrinkFoodById(id);
        if (!existingFood.isPresent()) {
            return ResponseEntity.status(404).body(new ApiResponse<>(404, null, "Không tìm thấy sản phẩm"));
        }
        drinkFoodService.deleteDrinkFood(id);
        return ResponseEntity.ok(new ApiResponse<>(200, null, "Xóa thành công"));
    }

    // ✅ Bật/Tắt trạng thái hoạt động
    @PutMapping("/{id}/active")
    public ResponseEntity<ApiResponse<DrinkFood>> toggleActive(@PathVariable Long id, @RequestBody Boolean isActive) {
        Optional<DrinkFood> existingFood = drinkFoodService.getDrinkFoodById(id);
        if (!existingFood.isPresent()) {
            return ResponseEntity.status(404).body(new ApiResponse<>(404, null, "Không tìm thấy sản phẩm"));
        }
        DrinkFood updatedFood = drinkFoodService.toggleActive(id, isActive);
        return ResponseEntity.ok(new ApiResponse<>(200, updatedFood, "Cập nhật trạng thái thành công"));
    }
}
