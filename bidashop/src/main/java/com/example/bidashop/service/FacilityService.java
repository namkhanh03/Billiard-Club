package com.example.bidashop.service;

import com.example.bidashop.model.BilliardTable;
import com.example.bidashop.model.Facility;
import com.example.bidashop.model.FacilityImage;
import com.example.bidashop.model.User;
import com.example.bidashop.repository.BilliardTableRepository;
import com.example.bidashop.repository.FacilityRepository;
import com.example.bidashop.repository.FacilityUserRepository;
import com.example.bidashop.repository.UserRepository;
import com.example.bidashop.utils.FirebaseImageUploadService;
import com.example.bidashop.utils.PaginationResponse;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FacilityService {

    @Autowired
    private FacilityRepository facilityRepository;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FacilityUserRepository facilityUserRepository;

    @Autowired
    private BilliardTableRepository billiardTableRepository;

    @Autowired
    private FirebaseImageUploadService firebaseImageUploadService;

    public PaginationResponse<Facility> getAllFacilities(String keyword, int page, int limit, Long userId) {
        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by("createdAt").descending());
        Page<Facility> facilityPage;

        // Kiểm tra userId để phân biệt quyền truy cập
        if (userId != null) {
            User user = userRepository.findById(userId).orElse(null);

            if (user != null && "ADMIN".equals(user.getRole().name())) {
                // Nếu user là ADMIN, lấy tất cả facility
                if (keyword != null && !keyword.isEmpty()) {
                    facilityPage = facilityRepository.findByNameContainingAndIsDeleteFalse(keyword, pageable);
                } else {
                    facilityPage = facilityRepository.findByIsDeleteFalse(pageable);
                }
            } else if (user != null) {
                // Nếu là user, lấy facility mà user quản lý
                List<Long> userManagedFacilityIds = facilityUserRepository.findFacilityIdsByUser(userId);

                if (userManagedFacilityIds.isEmpty()) {
                    // Nếu không có chi nhánh nào, trả về danh sách rỗng
                    facilityPage = new PageImpl<>(new ArrayList<>());
                } else {
                    // Tìm chi nhánh theo từ khóa (nếu có)
                    if (keyword != null && !keyword.isEmpty()) {
                        facilityPage = facilityRepository
                                .findByIdInAndNameContainingAndIsDeleteFalse(userManagedFacilityIds, keyword, pageable);
                    } else {
                        // Tìm chi nhánh mà user quản lý mà không cần tìm kiếm theo tên
                        facilityPage = facilityRepository.findByIdInAndIsDeleteFalse(userManagedFacilityIds, pageable);
                    }
                }
            } else {
                // Nếu user không hợp lệ, trả về danh sách rỗng hoặc lỗi
                throw new IllegalArgumentException("User không hợp lệ");
            }
        } else {
            // Nếu không có userId, trả về toàn bộ facility
            if (keyword != null && !keyword.isEmpty()) {
                facilityPage = facilityRepository.findByNameContainingAndIsDeleteFalse(keyword, pageable);
            } else {
                facilityPage = facilityRepository.findByIsDeleteFalse(pageable);
            }
        }

        // Trả về kết quả
        PaginationResponse<Facility> response = new PaginationResponse<>();
        response.setContent(facilityPage.getContent());
        response.setPage(page);
        response.setLimit(limit);
        response.setTotalElements(facilityPage.getTotalElements());
        response.setTotalPages(facilityPage.getTotalPages());

        return response;
    }

    // ✅ Lấy facility theo ID
    public Optional<Facility> getFacilityById(Long facilityId) {
        return facilityRepository.findById(facilityId).filter(facility -> !facility.getIsDelete());
    }

    @Transactional
    public Facility saveFacilityCreate(Long id, String name, String address, String phoneNumber,
            List<MultipartFile> imageFiles) throws IOException {

        Facility facility = (id != null) ? facilityRepository.findById(id).orElse(new Facility()) : new Facility();

        facility.setName(name);
        facility.setAddress(address);
        facility.setPhoneNumber(phoneNumber);

        if (facility.getCreatedAt() == null) {
            facility.setCreatedAt(LocalDateTime.now());
        }
        facility.setUpdatedAt(LocalDateTime.now());

        // ✅ Kiểm tra và khởi tạo danh sách images nếu cần
        if (facility.getImages() == null) {
            facility.setImages(new ArrayList<>()); // Khởi tạo nếu null
        }

        // ✅ Chỉ xóa ảnh cũ nếu có imageFiles mới
        if (imageFiles != null && !imageFiles.isEmpty()) {
            facility.getImages().clear(); // Xóa ảnh cũ nếu có tệp mới

            // ✅ Tải lên Firebase và lưu danh sách ảnh mới
            List<FacilityImage> facilityImages = imageFiles.stream()
                    .map(file -> {
                        try {
                            String imageUrl = firebaseImageUploadService.uploadImage(file);
                            return new FacilityImage(imageUrl, facility);
                        } catch (IOException e) {
                            throw new RuntimeException("Lỗi tải ảnh lên Firebase");
                        }
                    })
                    .collect(Collectors.toList());

            facility.getImages().addAll(facilityImages);
        }

        return facilityRepository.save(facility);
    }

    @Transactional
    public Facility saveFacility(Long id, String name, String address, String phoneNumber,
            List<MultipartFile> imageFiles) throws IOException {

        Facility facility = (id != null) ? facilityRepository.findById(id).orElse(new Facility()) : new Facility();

        facility.setName(name);
        facility.setAddress(address);
        facility.setPhoneNumber(phoneNumber);

        if (facility.getCreatedAt() == null) {
            facility.setCreatedAt(LocalDateTime.now());
        }
        facility.setUpdatedAt(LocalDateTime.now());

        // Ensure the images list is initialized if null
        if (facility.getImages() == null) {
            facility.setImages(new ArrayList<>());
        }

        // Separate old images (URLs) and new images (MultipartFile)
        List<String> existingImageUrls = new ArrayList<>();
        List<FacilityImage> newFacilityImages = new ArrayList<>();

        if (imageFiles != null && !imageFiles.isEmpty()) {
            for (MultipartFile file : imageFiles) {
                if (file.isEmpty())
                    continue;

                // If it's an existing image URL (not a MultipartFile), just keep it
                if (file.getOriginalFilename() == null) { // Assuming file with null filename is a URL
                    existingImageUrls.add(file.getName()); // The name might be the URL
                } else {
                    // For new images, upload them to Firebase
                    try {
                        String imageUrl = firebaseImageUploadService.uploadImage(file); // Upload to Firebase
                        newFacilityImages.add(new FacilityImage(imageUrl, facility)); // Add new image with Firebase URL
                    } catch (IOException e) {
                        throw new RuntimeException("Error uploading image to Firebase");
                    }
                }
            }
        }

        // Combine old images (URLs) with new uploaded images
        for (String imageUrl : existingImageUrls) {
            facility.getImages().add(new FacilityImage(imageUrl, facility)); // Add old images (URLs) to the list
        }
        facility.getImages().addAll(newFacilityImages); // Add new images (uploaded)

        return facilityRepository.save(facility); // Save the facility entity
    }

    // ✅ Xóa facility bằng cách cập nhật isDelete thành true
    public void deleteFacility(Long facilityId) {
        Optional<Facility> optionalFacility = facilityRepository.findById(facilityId);
        optionalFacility.ifPresent(facility -> {
            // Đánh dấu facility là đã xóa
            facility.setIsDelete(true);
            facilityRepository.save(facility);

            // Đánh dấu các bàn thuộc facility cũng là đã xóa
            List<BilliardTable> tables = billiardTableRepository.findAllByFacility(facility);
            for (BilliardTable table : tables) {
                table.setIsDelete(true);
            }
            billiardTableRepository.saveAll(tables);
        });
    }
}
