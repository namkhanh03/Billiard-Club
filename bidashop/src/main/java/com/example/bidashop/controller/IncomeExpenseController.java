package com.example.bidashop.controller;

import com.example.bidashop.model.Facility;
import com.example.bidashop.model.IncomeExpense;
import com.example.bidashop.model.User;
import com.example.bidashop.repository.FacilityRepository;
import com.example.bidashop.repository.UserRepository;
import com.example.bidashop.service.IncomeExpenseService;
import com.example.bidashop.utils.ApiResponse;
import com.example.bidashop.utils.PaginationResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/income-expenses")
public class IncomeExpenseController {

    @Autowired
    private IncomeExpenseService incomeExpenseService;

    @Autowired
    private FacilityRepository facilityRepository;

    @Autowired
    private UserRepository userRepository;

    // **Lấy danh sách thu chi với phân trang và lọc theo chi nhánh, ngày, loại hóa
    // đơn, userId**
    @GetMapping
    public ResponseEntity<ApiResponse<PaginationResponse<IncomeExpense>>> getAllIncomeExpense(
            @RequestParam(required = false) Long facilityId,
            @RequestParam(required = false) String type, // Income or Expense
            @RequestParam(required = false) String keyword, // Keyword to search in description or type
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ssXXX") LocalDate date,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam Long userId) { // userId will decide access rights

        PaginationResponse<IncomeExpense> incomeExpenses = incomeExpenseService.getAllIncomeExpense(
                facilityId, type, date, page, limit, userId);

        ApiResponse<PaginationResponse<IncomeExpense>> response = new ApiResponse<>(200, incomeExpenses,
                "Lấy danh sách thu chi thành công");
        return ResponseEntity.ok(response);
    }

    // **Tạo mới hóa đơn thu chi**
    @PostMapping
    public ResponseEntity<ApiResponse<IncomeExpense>> createIncomeExpense(
            @RequestParam("type") String type,
            @RequestParam("amount") Double amount,
            @RequestParam("date") String dateString,
            @RequestParam("description") String description,
            @RequestParam("facilityId") Long facilityId,
            @RequestParam("userId") Long userId,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        try {
            // Convert the date string to LocalDateTime
            DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME; // This handles the 'Z' suffix
            LocalDateTime date = LocalDateTime.parse(dateString, formatter);

            // Fetch Facility and User from the database
            Optional<Facility> facilityOptional = facilityRepository.findById(facilityId);
            Optional<User> userOptional = userRepository.findById(userId);

            // Check if Facility and User exist
            if (!facilityOptional.isPresent()) {
                return ResponseEntity.status(400).body(new ApiResponse<>(400, null, "Facility does not exist"));
            }

            if (!userOptional.isPresent()) {
                return ResponseEntity.status(400).body(new ApiResponse<>(400, null, "User does not exist"));
            }

            Facility facility = facilityOptional.get();
            User user = userOptional.get();

            // Call service to create IncomeExpense with file handling
            IncomeExpense createdIncomeExpense = incomeExpenseService.createIncomeExpense(
                    type,
                    amount,
                    date,
                    description,
                    facility,
                    user,
                    file);

            // Return response with the created IncomeExpense
            ApiResponse<IncomeExpense> response = new ApiResponse<>(201, createdIncomeExpense,
                    "Income/Expense created successfully");
            return ResponseEntity.status(201).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(new ApiResponse<>(500, null, "Error creating income/expense: " + e.getMessage()));
        }
    }

    // **Cập nhật hóa đơn thu chi**
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<IncomeExpense>> updateIncomeExpense(
            @PathVariable Long id,
            @RequestParam("type") String type,
            @RequestParam("amount") Double amount,
            @RequestParam("date") String dateString,
            @RequestParam("description") String description,
            @RequestParam("facilityId") Long facilityId,
            @RequestParam("userId") Long userId,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        try {
            // Convert the date string to LocalDateTime
            DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
            LocalDateTime date = LocalDateTime.parse(dateString, formatter);

            // Fetch Facility and User from the database
            Optional<Facility> facilityOptional = facilityRepository.findById(facilityId);
            Optional<User> userOptional = userRepository.findById(userId);

            // Check if Facility and User exist
            if (!facilityOptional.isPresent()) {
                return ResponseEntity.status(400).body(new ApiResponse<>(400, null, "Facility does not exist"));
            }

            if (!userOptional.isPresent()) {
                return ResponseEntity.status(400).body(new ApiResponse<>(400, null, "User does not exist"));
            }

            Facility facility = facilityOptional.get();
            User user = userOptional.get();

            // Call the service to update the IncomeExpense
            IncomeExpense updatedIncomeExpense = incomeExpenseService.updateIncomeExpense(
                    id, type, amount, date, description, facility.getId(), user.getUserId(), file);

            // Return the updated IncomeExpense with success response
            ApiResponse<IncomeExpense> response = new ApiResponse<>(200, updatedIncomeExpense,
                    "Cập nhật thu chi thành công");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(new ApiResponse<>(500, null, "Lỗi khi cập nhật thu chi: " + e.getMessage()));
        }
    }

    // **Xóa hóa đơn thu chi**
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteIncomeExpense(@PathVariable Long id) {
        try {
            incomeExpenseService.deleteIncomeExpense(id);
            return ResponseEntity.ok(new ApiResponse<>(200, null, "Xóa thu chi thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(new ApiResponse<>(500, null, "Lỗi khi xóa thu chi: " + e.getMessage()));
        }
    }

    // **Lấy tổng thu, chi trong khoảng thời gian**
    @GetMapping("/total")
    public ResponseEntity<ApiResponse<Map<String, Double>>> getTotalByDate(
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ssXXX") LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ssXXX") LocalDate toDate) {
        try {

            Map<String, Double> total = incomeExpenseService.getTotalByDate(fromDate, toDate);
            return ResponseEntity.ok(new ApiResponse<>(200, total, "Lấy tổng thu chi thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(new ApiResponse<>(500, null, "Lỗi khi lấy tổng thu chi: " + e.getMessage()));
        }
    }
}
