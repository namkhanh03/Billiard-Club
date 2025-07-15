package com.example.bidashop.controller;

import com.example.bidashop.model.Facility;
import com.example.bidashop.repository.FacilityRepository;
import com.example.bidashop.service.FacilityService;
import com.example.bidashop.utils.ApiResponse;
import com.example.bidashop.utils.PaginationResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/facilities")
public class FacilityController {

    @Autowired
    private FacilityService facilityService;

    @Autowired
    private FacilityRepository facilityRepository;

    // Lấy tất cả các facility chưa bị xóa với phân trang, tìm kiếm
    @GetMapping
    public ResponseEntity<ApiResponse<PaginationResponse<Facility>>> getAllFacilities(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "1") int page, // Mặc định là page 1
            @RequestParam(defaultValue = "10") int limit, // Mặc định là limit 10
            @RequestParam(required = false) Long userId) { // Thêm userId làm tham số

        PaginationResponse<Facility> facilities = facilityService.getAllFacilities(keyword, page, limit, userId);
        ApiResponse<PaginationResponse<Facility>> response = new ApiResponse<>(200, facilities,
                "Lấy danh sách facility thành công");
        return ResponseEntity.ok(response);
    }

    // Lấy facility theo ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Facility>> getFacilityById(@PathVariable Long id) {
        Optional<Facility> facility = facilityService.getFacilityById(id);
        return facility.map(fac -> {
            ApiResponse<Facility> response = new ApiResponse<>(200, fac, "Lấy facility thành công");
            return ResponseEntity.ok(response);
        }).orElseGet(() -> {
            ApiResponse<Facility> response = new ApiResponse<>(404, null, "Không tìm thấy facility");
            return ResponseEntity.status(404).body(response);
        });
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Facility>> createFacility(
            @RequestParam("name") String name,
            @RequestParam("address") String address,
            @RequestParam("phoneNumber") String phoneNumber,
            @RequestPart(value = "images", required = false) List<MultipartFile> imageFiles) {
        try {
            Facility savedFacility = facilityService.saveFacilityCreate(null, name, address, phoneNumber, imageFiles);
            return ResponseEntity.status(201)
                    .body(new ApiResponse<>(201, savedFacility, "Tạo mới facility thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(500, null, "Lỗi: " + e.getMessage()));
        }
    }

    // Cập nhật facility
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Facility>> updateFacility(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam("address") String address,
            @RequestParam("phoneNumber") String phoneNumber,
            @RequestPart(value = "images", required = false) List<MultipartFile> imageFiles) {
        try {
            Optional<Facility> existingFacility = facilityRepository.findById(id);
            if (!existingFacility.isPresent()) {
                return ResponseEntity.status(404).body(new ApiResponse<>(404, null, "Facility not found"));
            }
    
            Facility updatedFacility = facilityService.saveFacility(id, name, address, phoneNumber, imageFiles);
            return ResponseEntity.ok(new ApiResponse<>(200, updatedFacility, "Facility updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(500, null, "Error: " + e.getMessage()));
        }
    }    

    // Xóa facility (chuyển isDelete thành true)
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteFacility(@PathVariable Long id) {
        Optional<Facility> existingFacility = facilityService.getFacilityById(id);
        if (existingFacility.isPresent()) {
            facilityService.deleteFacility(id);
            ApiResponse<Void> response = new ApiResponse<>(200, null, "Xóa facility thành công");
            return ResponseEntity.ok(response);
        } else {
            ApiResponse<Void> response = new ApiResponse<>(404, null, "Không tìm thấy facility để xóa");
            return ResponseEntity.status(404).body(response);
        }
    }
}
