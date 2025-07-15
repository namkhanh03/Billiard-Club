package com.example.bidashop.service;

import com.example.bidashop.model.BilliardTable;
import com.example.bidashop.model.Facility;
import com.example.bidashop.model.Pricing;
import com.example.bidashop.model.User;
import com.example.bidashop.repository.BilliardTableRepository;
import com.example.bidashop.repository.FacilityRepository;
import com.example.bidashop.repository.UserRepository;
import com.example.bidashop.utils.PaginationResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BilliardTableService {

    @Autowired
    private BilliardTableRepository billiardTableRepository;

    @Autowired
    private FacilityRepository facilityRepository;

    @Autowired
    private UserRepository userRepository;

    // **Lấy danh sách bàn bi-a (có tìm kiếm, phân trang)**
    public PaginationResponse<BilliardTable> getAllBilliardTables(String keyword, Long facilityId, int page, int limit,
                                                                  Long userId) {
        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by("createdAt").descending());
        Page<BilliardTable> tablePage;

        // Nếu không có userId, trả về toàn bộ (mặc định kiểu ADMIN)
        if (userId == null) {
            if (facilityId != null) {
                tablePage = billiardTableRepository.findByFacilityIdAndIsDeleteFalse(facilityId, pageable);
            } else {
                tablePage = billiardTableRepository.findByIsDeleteFalse(pageable);
            }
        } else {
            // Có userId → kiểm tra role
            Optional<User> userOptional = userRepository.findById(userId);
            if (userOptional.isPresent()) {
                User loggedInUser = userOptional.get();
                String role = loggedInUser.getRole().toString();

                if ("ADMIN".equals(role) || "CUSTOMER".equals(role)) {
                    if (keyword != null && !keyword.isEmpty() && facilityId != null) {
                        tablePage = billiardTableRepository.findByNameContainingAndFacilityIdAndIsDeleteFalse(keyword,
                                facilityId, pageable);
                    } else if (keyword != null && !keyword.isEmpty()) {
                        tablePage = billiardTableRepository.findByNameContainingAndIsDeleteFalse(keyword, pageable);
                    } else if (facilityId != null) {
                        tablePage = billiardTableRepository.findByFacilityIdAndIsDeleteFalse(facilityId, pageable);
                    } else {
                        tablePage = billiardTableRepository.findByIsDeleteFalse(pageable);
                    }
                } else if ("MANAGER".equals(role) || "STAFF".equals(role)) {
                    List<Long> managedFacilityIds = loggedInUser.getManagedFacilities().stream()
                            .map(fu -> fu.getFacility().getId())
                            .collect(Collectors.toList());

                    if (managedFacilityIds.isEmpty()) {
                        tablePage = new PageImpl<>(new ArrayList<>());
                    } else {
                        if (keyword != null && !keyword.isEmpty()) {
                            tablePage = billiardTableRepository.findByFacilityIdInAndNameContainingAndIsDeleteFalse(
                                    managedFacilityIds, keyword, pageable);
                        } else {
                            tablePage = billiardTableRepository.findByFacilityIdInAndIsDeleteFalse(managedFacilityIds, pageable);
                        }
                    }
                } else {
                    tablePage = new PageImpl<>(new ArrayList<>());
                }
            } else {
                tablePage = new PageImpl<>(new ArrayList<>());
            }
        }

        PaginationResponse<BilliardTable> response = new PaginationResponse<>();
        response.setContent(tablePage.getContent());
        response.setPage(page);
        response.setLimit(limit);
        response.setTotalElements(tablePage.getTotalElements());
        response.setTotalPages(tablePage.getTotalPages());

        return response;
    }


    // **Lấy bàn bi-a theo ID**
    public Optional<BilliardTable> getBilliardTableById(Long id) {
        return billiardTableRepository.findById(id).filter(table -> !table.getIsDelete());
    }

    // **Thêm hoặc cập nhật bàn bi-a**
    public BilliardTable saveBilliardTable(Long id, String name, String status, Long facilityId, Pricing pricing) {
        BilliardTable table = id != null ? billiardTableRepository.findById(id).orElse(new BilliardTable())
                : new BilliardTable();

        table.setName(name);
        table.setStatus(status);
        table.setIsActive(true);

        // Gán Facility
        if (facilityId != null) {
            Facility facility = facilityRepository.findById(facilityId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy cơ sở"));
            table.setFacility(facility);
        }

        // Gán Pricing
        if (pricing != null) {
            table.setPricing(pricing); // Gán pricing cho bàn bi-a
        }

        // Cập nhật thời gian
        if (table.getCreatedAt() == null) {
            table.setCreatedAt(LocalDateTime.now());
        }
        table.setUpdatedAt(LocalDateTime.now());

        return billiardTableRepository.save(table);
    }

    // **Xóa bàn bi-a (soft delete)**
    public void deleteBilliardTable(Long id) {
        billiardTableRepository.findById(id).ifPresent(table -> {
            table.setIsDelete(true);
            table.setUpdatedAt(LocalDateTime.now());
            billiardTableRepository.save(table);
        });
    }

    // **Kích hoạt / Vô hiệu hóa bàn bi-a**
    public BilliardTable toggleActive(Long id, Boolean isActive) {
        Optional<BilliardTable> existingTable = billiardTableRepository.findById(id);
        if (!existingTable.isPresent()) {
            throw new RuntimeException("Không tìm thấy bàn bi-a");
        }

        BilliardTable table = existingTable.get();
        table.setIsActive(isActive);
        table.setUpdatedAt(LocalDateTime.now());
        return billiardTableRepository.save(table);
    }

    // ✅ Chỉ cập nhật status
    public BilliardTable changeStatus(Long id, String newStatus) {
        Optional<BilliardTable> optionalTable = billiardTableRepository.findById(id);
        if (optionalTable.isEmpty()) {
            throw new RuntimeException("Không tìm thấy bàn bi-a");
        }

        BilliardTable table = optionalTable.get();
        table.setStatus(newStatus);
        table.setUpdatedAt(LocalDateTime.now());

        return billiardTableRepository.save(table);
    }

}
