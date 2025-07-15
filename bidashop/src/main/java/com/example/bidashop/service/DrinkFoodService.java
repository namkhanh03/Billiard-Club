package com.example.bidashop.service;

import com.example.bidashop.model.Category;
import com.example.bidashop.model.DrinkFood;
import com.example.bidashop.model.Facility;
import com.example.bidashop.model.FacilityUser;
import com.example.bidashop.repository.CategoryRepository;
import com.example.bidashop.repository.DrinkFoodRepository;
import com.example.bidashop.repository.FacilityUserRepository;
import com.example.bidashop.utils.FirebaseImageUploadService;
import com.example.bidashop.utils.PaginationResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class DrinkFoodService {

    @Autowired
    private DrinkFoodRepository drinkFoodRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private FacilityUserRepository facilityUserRepository;

    @Autowired
    private FirebaseImageUploadService firebaseImageUploadService;

    public PaginationResponse<DrinkFood> getAllDrinkFoods(String keyword, int page, int limit, Long categoryId,
            Long facilityId, Long userId) {
        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by("createdAt").descending());
        Page<DrinkFood> foodPage;

        // Nếu có userId và user là MANAGER/ADMIN → chỉ lấy theo facility của user
        if (userId != null) {
            List<FacilityUser> managedFacilities = facilityUserRepository.findByUserId(userId);
            List<Long> facilityIds = managedFacilities.stream()
                    .map(fu -> fu.getFacility().getId())
                    .toList();

            if (!facilityIds.isEmpty()) {
                // Nếu có truyền facilityId → kiểm tra xem có thuộc danh sách facility của user
                // hay không
                if (facilityId != null && !facilityIds.contains(facilityId)) {
                    // Nếu không thuộc quyền quản lý, bỏ qua filter theo facilityId (chỉ lấy theo
                    // danh sách được quản lý)
                    facilityId = null;
                }

                // Nếu có truyền facilityId và hợp lệ → filter theo facilityId đó
                if (facilityId != null) {
                    if (keyword != null && !keyword.isEmpty() && categoryId != null) {
                        foodPage = drinkFoodRepository.findByNameContainingAndCategoryIdAndFacilityIdAndIsDeleteFalse(
                                keyword, categoryId, facilityId, pageable);
                    } else if (keyword != null && !keyword.isEmpty()) {
                        foodPage = drinkFoodRepository.findByNameContainingAndFacilityIdAndIsDeleteFalse(keyword,
                                facilityId, pageable);
                    } else if (categoryId != null) {
                        foodPage = drinkFoodRepository.findByCategoryIdAndFacilityIdAndIsDeleteFalse(categoryId,
                                facilityId, pageable);
                    } else {
                        foodPage = drinkFoodRepository.findByFacilityIdAndIsDeleteFalse(facilityId, pageable);
                    }
                } else {
                    // Không truyền facilityId → dùng danh sách facilityIds của user
                    if (keyword != null && !keyword.isEmpty() && categoryId != null) {
                        foodPage = drinkFoodRepository.findByNameContainingAndCategoryIdAndFacilityIdInAndIsDeleteFalse(
                                keyword, categoryId, facilityIds, pageable);
                    } else if (keyword != null && !keyword.isEmpty()) {
                        foodPage = drinkFoodRepository.findByNameContainingAndFacilityIdInAndIsDeleteFalse(keyword,
                                facilityIds, pageable);
                    } else if (categoryId != null) {
                        foodPage = drinkFoodRepository.findByCategoryIdAndFacilityIdInAndIsDeleteFalse(categoryId,
                                facilityIds, pageable);
                    } else {
                        foodPage = drinkFoodRepository.findByFacilityIdInAndIsDeleteFalse(facilityIds, pageable);
                    }
                }

                PaginationResponse<DrinkFood> response = new PaginationResponse<>();
                response.setContent(foodPage.getContent());
                response.setPage(page);
                response.setLimit(limit);
                response.setTotalElements(foodPage.getTotalElements());
                response.setTotalPages(foodPage.getTotalPages());
                return response;
            }
        }

        // Trường hợp không có userId hoặc user không quản lý facility → dùng logic hiện
        // tại
        if (keyword != null && !keyword.isEmpty() && categoryId != null && facilityId != null) {
            foodPage = drinkFoodRepository.findByNameContainingAndCategoryIdAndFacilityIdAndIsDeleteFalse(keyword,
                    categoryId, facilityId, pageable);
        } else if (keyword != null && !keyword.isEmpty() && categoryId != null) {
            foodPage = drinkFoodRepository.findByNameContainingAndCategoryIdAndIsDeleteFalse(keyword, categoryId,
                    pageable);
        } else if (keyword != null && !keyword.isEmpty() && facilityId != null) {
            foodPage = drinkFoodRepository.findByNameContainingAndFacilityIdAndIsDeleteFalse(keyword, facilityId,
                    pageable);
        } else if (keyword != null && !keyword.isEmpty()) {
            foodPage = drinkFoodRepository.findByNameContainingAndIsDeleteFalse(keyword, pageable);
        } else if (categoryId != null && facilityId != null) {
            foodPage = drinkFoodRepository.findByCategoryIdAndFacilityIdAndIsDeleteFalse(categoryId, facilityId,
                    pageable);
        } else if (categoryId != null) {
            foodPage = drinkFoodRepository.findByCategoryIdAndIsDeleteFalse(categoryId, pageable);
        } else if (facilityId != null) {
            foodPage = drinkFoodRepository.findByFacilityIdAndIsDeleteFalse(facilityId, pageable);
        } else {
            foodPage = drinkFoodRepository.findByIsDeleteFalse(pageable);
        }

        PaginationResponse<DrinkFood> response = new PaginationResponse<>();
        response.setContent(foodPage.getContent());
        response.setPage(page);
        response.setLimit(limit);
        response.setTotalElements(foodPage.getTotalElements());
        response.setTotalPages(foodPage.getTotalPages());

        return response;
    }

    public Optional<DrinkFood> getDrinkFoodById(Long id) {
        return drinkFoodRepository.findById(id);
    }

    public DrinkFood saveDrinkFood(Long id, String name, Double price, String description, Long categoryId,
            Long facilityId, Integer quantity, Integer warningThreshold, MultipartFile imageFile) throws IOException {

        DrinkFood food = id != null ? drinkFoodRepository.findById(id).orElse(new DrinkFood()) : new DrinkFood();

        food.setName(name);
        food.setPrice(price);
        food.setDescription(description);
        food.setIsActive(true);
        food.setQuantity(quantity);
        food.setWarningThreshold(warningThreshold);

        if (categoryId != null) {
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục"));
            food.setCategory(category);
        }

        if (facilityId != null) {
            Facility facility = new Facility();
            facility.setId(facilityId);
            food.setFacility(facility);
        }

        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = firebaseImageUploadService.uploadImage(imageFile);
            food.setImage(imageUrl);
        }

        if (food.getCreatedAt() == null) {
            food.setCreatedAt(LocalDateTime.now());
        }
        food.setUpdatedAt(LocalDateTime.now());

        return drinkFoodRepository.save(food);
    }

    public void deleteDrinkFood(Long id) {
        Optional<DrinkFood> food = drinkFoodRepository.findById(id);
        food.ifPresent(f -> {
            f.setIsDelete(true);
            drinkFoodRepository.save(f);
        });
    }

    public DrinkFood toggleActive(Long id, Boolean isActive) {
        Optional<DrinkFood> food = drinkFoodRepository.findById(id);
        if (food.isPresent()) {
            food.get().setIsActive(isActive);
            return drinkFoodRepository.save(food.get());
        }
        return null;
    }
}
