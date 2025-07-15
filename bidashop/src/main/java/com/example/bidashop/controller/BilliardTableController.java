package com.example.bidashop.controller;

import com.example.bidashop.model.BilliardTable;
import com.example.bidashop.model.Facility;
import com.example.bidashop.model.Pricing;
import com.example.bidashop.service.BilliardTableService;
import com.example.bidashop.service.FacilityService;
import com.example.bidashop.service.PricingService;
import com.example.bidashop.utils.ApiResponse;
import com.example.bidashop.utils.PaginationResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/billiard-tables")
public class BilliardTableController {

    @Autowired
    private BilliardTableService billiardTableService;

    @Autowired
    private FacilityService facilityService;

    @Autowired
    private PricingService pricingService;

    // **Lấy danh sách bàn bi-a với phân trang & tìm kiếm**
    @GetMapping
    public ResponseEntity<ApiResponse<PaginationResponse<BilliardTable>>> getAllBilliardTables(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long facilityId, // Filter by facilityId
            @RequestParam(defaultValue = "1") int page, // Default page is 1
            @RequestParam(defaultValue = "10") int limit, // Default limit is 10
            @RequestParam(required = false) Long userId) { // Added userId to determine the access rights

        PaginationResponse<BilliardTable> tables = billiardTableService.getAllBilliardTables(keyword, facilityId, page,
                limit, userId);
        ApiResponse<PaginationResponse<BilliardTable>> response = new ApiResponse<>(200, tables,
                "Lấy danh sách bàn bi-a thành công");

        return ResponseEntity.ok(response);
    }

    // **Lấy bàn bi-a theo ID**
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BilliardTable>> getBilliardTableById(@PathVariable Long id) {
        Optional<BilliardTable> table = billiardTableService.getBilliardTableById(id);
        if (table.isPresent()) {
            return ResponseEntity.ok(new ApiResponse<>(200, table.get(), "Lấy bàn bi-a thành công"));
        }
        return ResponseEntity.status(404).body(new ApiResponse<>(404, null, "Không tìm thấy bàn bi-a"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BilliardTable>> createBilliardTable(
            @RequestBody Map<String, Object> requestBody) {
        try {
            String name = (String) requestBody.get("name");
            String status = (String) requestBody.get("status");
            Long facilityId = Long.valueOf(requestBody.get("facilityId").toString());
            Long pricingId = Long.valueOf(requestBody.get("pricingId").toString()); // Lấy pricingId từ request

            // Kiểm tra xem facility có tồn tại không
            Optional<Facility> facilityOpt = facilityService.getFacilityById(facilityId);
            if (facilityOpt.isEmpty()) {
                return ResponseEntity.status(400)
                        .body(new ApiResponse<>(400, null, "Facility không tồn tại."));
            }

            // Kiểm tra xem pricing có tồn tại không
            Optional<Pricing> pricingOpt = pricingService.getPricingById(pricingId);
            if (pricingOpt.isEmpty()) {
                return ResponseEntity.status(400)
                        .body(new ApiResponse<>(400, null, "Pricing không tồn tại."));
            }

            // Tạo bàn bi-a
            BilliardTable savedTable = billiardTableService.saveBilliardTable(null, name, status, facilityId,
                    pricingOpt.get());
            return ResponseEntity.status(201)
                    .body(new ApiResponse<>(201, savedTable, "Tạo mới bàn bi-a thành công"));

        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(new ApiResponse<>(500, null, "Lỗi khi tạo bàn bi-a: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<BilliardTable>> updateBilliardTable(
            @PathVariable Long id,
            @RequestBody Map<String, Object> requestBody) {
        try {
            Optional<BilliardTable> existingTable = billiardTableService.getBilliardTableById(id);
            if (!existingTable.isPresent()) {
                return ResponseEntity.status(404)
                        .body(new ApiResponse<>(404, null, "Không tìm thấy bàn bi-a để cập nhật"));
            }

            // Trích xuất thông tin từ requestBody
            String name = (String) requestBody.get("name");
            String status = (String) requestBody.get("status");
            Long facilityId = Long.valueOf(requestBody.get("facilityId").toString());
            Long pricingId = Long.valueOf(requestBody.get("pricingId").toString()); // Lấy pricingId từ request

            // Cập nhật bàn bi-a
            Optional<Facility> facilityOpt = facilityService.getFacilityById(facilityId);
            Optional<Pricing> pricingOpt = pricingService.getPricingById(pricingId);

            if (facilityOpt.isEmpty()) {
                return ResponseEntity.status(400)
                        .body(new ApiResponse<>(400, null, "Facility không tồn tại."));
            }

            if (pricingOpt.isEmpty()) {
                return ResponseEntity.status(400)
                        .body(new ApiResponse<>(400, null, "Pricing không tồn tại."));
            }

            BilliardTable updatedTable = billiardTableService.saveBilliardTable(
                    id, name, status, facilityId, pricingOpt.get()); // Cập nhật với Pricing

            return ResponseEntity.ok(new ApiResponse<>(200, updatedTable, "Cập nhật bàn bi-a thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(new ApiResponse<>(500, null, "Lỗi khi cập nhật bàn bi-a: " + e.getMessage()));
        }
    }

    // **Xóa bàn bi-a**
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBilliardTable(@PathVariable Long id) {
        Optional<BilliardTable> existingTable = billiardTableService.getBilliardTableById(id);
        if (!existingTable.isPresent()) {
            return ResponseEntity.status(404).body(new ApiResponse<>(404, null, "Không tìm thấy bàn bi-a để xóa"));
        }
        billiardTableService.deleteBilliardTable(id);
        return ResponseEntity.ok(new ApiResponse<>(200, null, "Xóa bàn bi-a thành công"));
    }

    // **Kích hoạt / Vô hiệu hóa bàn bi-a**
    @PutMapping("/{id}/active")
    public ResponseEntity<ApiResponse<BilliardTable>> toggleActive(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> requestBody) {
        try {
            Optional<BilliardTable> existingTable = billiardTableService.getBilliardTableById(id);
            if (!existingTable.isPresent()) {
                return ResponseEntity.status(404).body(new ApiResponse<>(404, null, "Không tìm thấy bàn bi-a"));
            }

            Boolean isActive = requestBody.get("isActive");
            if (isActive == null) {
                return ResponseEntity.status(400)
                        .body(new ApiResponse<>(400, null, "Thiếu trường isActive trong request body"));
            }

            BilliardTable table = billiardTableService.toggleActive(id, isActive);
            return ResponseEntity.ok(new ApiResponse<>(200, table, "Cập nhật trạng thái bàn bi-a thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(new ApiResponse<>(500, null, "Lỗi khi cập nhật trạng thái: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<BilliardTable>> changeStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> requestBody) {
        try {
            String status = requestBody.get("status");
            if (status == null || status.trim().isEmpty()) {
                return ResponseEntity.status(400)
                        .body(new ApiResponse<>(400, null, "Trường 'status' là bắt buộc."));
            }

            BilliardTable updated = billiardTableService.changeStatus(id, status);
            return ResponseEntity.ok(new ApiResponse<>(200, updated, "Cập nhật trạng thái bàn thành công"));

        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(new ApiResponse<>(500, null, "Lỗi khi cập nhật trạng thái bàn: " + e.getMessage()));
        }
    }

}
