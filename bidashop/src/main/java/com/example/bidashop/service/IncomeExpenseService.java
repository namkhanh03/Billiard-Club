package com.example.bidashop.service;

import com.example.bidashop.model.IncomeExpense;
import com.example.bidashop.model.Facility;
import com.example.bidashop.model.User;
import com.example.bidashop.repository.IncomeExpenseRepository;
import com.example.bidashop.repository.FacilityRepository;
import com.example.bidashop.repository.UserRepository;
import com.example.bidashop.utils.FirebaseImageUploadService;
import com.example.bidashop.utils.PaginationResponse;

import io.jsonwebtoken.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class IncomeExpenseService {

    @Autowired
    private IncomeExpenseRepository incomeExpenseRepository;

    @Autowired
    private FacilityRepository facilityRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FirebaseImageUploadService firebaseImageUploadService;

    public PaginationResponse<IncomeExpense> getAllIncomeExpense(Long facilityId, String type, LocalDate date,
            int page, int limit, Long userId) {

        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by("date").descending()); // Sắp xếp theo date
        Page<IncomeExpense> incomeExpensePage;

        if (userId != null) {
            Optional<User> user = userRepository.findById(userId);
            if (user.isPresent()) {
                User loggedInUser = user.get();

                if ("ADMIN".equals(loggedInUser.getRole().toString())) {
                    // ADMIN: Tìm kiếm tất cả với các bộ lọc theo date
                    incomeExpensePage = applyAdminFilters(facilityId, type, date, pageable);
                } else if ("MANAGER".equals(loggedInUser.getRole().toString())
                        || "STAFF".equals(loggedInUser.getRole().toString())) {
                    List<Long> facilityIds = loggedInUser.getManagedFacilities().stream()
                            .map(facilityUser -> facilityUser.getFacility().getId())
                            .collect(Collectors.toList());

                    if (facilityIds.isEmpty()) {
                        incomeExpensePage = new PageImpl<>(new ArrayList<>());
                    } else {
                        // MANAGER/STAFF: Lọc theo các chi nhánh quản lý
                        incomeExpensePage = applyManagerFilters(facilityIds, type, date, pageable);
                    }
                } else {
                    incomeExpensePage = new PageImpl<>(new ArrayList<>());
                }
            } else {
                incomeExpensePage = new PageImpl<>(new ArrayList<>());
            }
        } else {
            // Nếu không có userId, mặc định áp dụng filter cho ADMIN
            incomeExpensePage = applyAdminFilters(facilityId, type, date, pageable);
        }

        PaginationResponse<IncomeExpense> response = new PaginationResponse<>();
        response.setContent(incomeExpensePage.getContent());
        response.setPage(page);
        response.setLimit(limit);
        response.setTotalElements(incomeExpensePage.getTotalElements());
        response.setTotalPages(incomeExpensePage.getTotalPages());

        return response;
    }

    private Page<IncomeExpense> applyAdminFilters(Long facilityId, String type, LocalDate date, Pageable pageable) {
        if (type != null) {
            if (date != null) {
                return incomeExpenseRepository.findAllByTypeAndDateAndIsDeleteFalse(type, date, pageable);
            } else {
                return incomeExpenseRepository.findAllByTypeAndIsDeleteFalse(type, pageable);
            }
        } else {
            if (date != null) {
                return incomeExpenseRepository.findAllByDateAndIsDeleteFalse(date, pageable);
            } else {
                return incomeExpenseRepository.findAllByIsDeleteFalse(pageable);
            }
        }
    }

    private Page<IncomeExpense> applyManagerFilters(List<Long> facilityIds, String type, LocalDate date,
            Pageable pageable) {
        if (type != null) {
            if (date != null) {
                return incomeExpenseRepository.findByFacilityIdInAndTypeAndDateAndIsDeleteFalse(facilityIds, type,
                        date, pageable);
            } else {
                return incomeExpenseRepository.findByFacilityIdInAndTypeAndIsDeleteFalse(facilityIds, type, pageable);
            }
        } else {
            if (date != null) {
                return incomeExpenseRepository.findByFacilityIdInAndDateAndIsDeleteFalse(facilityIds, date,
                        pageable);
            } else {
                return incomeExpenseRepository.findByFacilityIdInAndIsDeleteFalse(facilityIds, pageable);
            }
        }
    }

    public IncomeExpense createIncomeExpense(String type, Double amount, LocalDateTime date, String description,
            Facility facility, User createdBy, MultipartFile file) throws IOException, java.io.IOException {

        // Convert LocalDateTime to LocalDate
        LocalDate dateOnly = date.toLocalDate();

        // Upload the file and get the file URL
        String documentPath = file != null ? firebaseImageUploadService.uploadImage(file) : null;

        // Create and save the IncomeExpense entity
        IncomeExpense incomeExpense = new IncomeExpense();
        incomeExpense.setType(type);
        incomeExpense.setAmount(amount);
        incomeExpense.setDate(dateOnly);
        incomeExpense.setDescription(description);
        incomeExpense.setFacility(facility);
        incomeExpense.setCreatedBy(createdBy);
        incomeExpense.setCreatedAt(LocalDateTime.now());
        incomeExpense.setUpdatedAt(LocalDateTime.now());
        incomeExpense.setDocumentPath(documentPath); // Save the document path

        return incomeExpenseRepository.save(incomeExpense);
    }

    public IncomeExpense updateIncomeExpense(Long id, String type, Double amount, LocalDateTime date,
            String description, Long facilityId, Long userId, MultipartFile file)
            throws IOException, java.io.IOException {

        // Convert LocalDateTime to LocalDate
        LocalDate dateOnly = date.toLocalDate();

        // Fetch the existing IncomeExpense
        IncomeExpense incomeExpense = incomeExpenseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("IncomeExpense not found"));

        // Fetch the associated Facility and User
        Facility facility = facilityRepository.findById(facilityId)
                .orElseThrow(() -> new IllegalArgumentException("Facility not found"));
        User createdBy = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Upload file if provided
        String documentPath = file != null ? firebaseImageUploadService.uploadImage(file) : null;

        // Update the fields of the IncomeExpense object
        incomeExpense.setType(type);
        incomeExpense.setAmount(amount);
        incomeExpense.setDate(dateOnly);
        incomeExpense.setDescription(description);
        incomeExpense.setFacility(facility);
        incomeExpense.setCreatedBy(createdBy);
        incomeExpense.setUpdatedAt(LocalDateTime.now()); // Set the update timestamp
        incomeExpense.setDocumentPath(documentPath); // Save the document path if provided

        return incomeExpenseRepository.save(incomeExpense);
    }

    // **Xóa thu chi**
    public void deleteIncomeExpense(Long id) {
        // Find the incomeExpense by id
        IncomeExpense incomeExpense = incomeExpenseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("IncomeExpense not found"));

        // Set isDelete to true (soft delete)
        incomeExpense.setIsDelete(true);

        // Save the updated incomeExpense
        incomeExpenseRepository.save(incomeExpense);
    }

    // **Lấy tổng thu chi trong khoảng thời gian**
    public Map<String, Double> getTotalByDate(LocalDate fromDate, LocalDate toDate) {
        Double totalIncome = incomeExpenseRepository.calculateTotalIncome(fromDate, toDate);
        Double totalExpense = incomeExpenseRepository.calculateTotalExpense(fromDate, toDate);

        return Map.of(
                "totalIncome", totalIncome != null ? totalIncome : 0.0,
                "totalExpense", totalExpense != null ? totalExpense : 0.0);
    }
}
