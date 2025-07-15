package com.example.bidashop.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.bidashop.model.User;
import com.example.bidashop.repository.UserRepository;
import com.example.bidashop.service.RevenueService;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/revenue")
public class RevenueController {

        @Autowired
        private RevenueService revenueService;

        @Autowired
        private UserRepository userRepository; // cần lấy role user

        @GetMapping("/summary")
        public ResponseEntity<?> getRevenueSummary(@RequestParam("userId") Long userId) {
                Map<String, Object> response = new HashMap<>();

                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                List<Long> facilityIds;

                if (user.getRole() == User.Role.ADMIN) {
                        facilityIds = revenueService.getAllFacilityIds(); // ✅ Lấy toàn bộ chi nhánh
                } else {
                        facilityIds = revenueService.getFacilityIdsManagedByUser(userId); // ✅ Lấy facility user quản lý
                }

                BigDecimal todayRevenue = revenueService.getTodayRevenue(facilityIds);
                BigDecimal yesterdayRevenue = revenueService.getYesterdayRevenue(facilityIds);
                BigDecimal monthlyRevenue = revenueService.getMonthRevenue(facilityIds);
                BigDecimal lastMonthRevenue = revenueService.getLastMonthRevenue(facilityIds);
                BigDecimal yearlyRevenue = revenueService.getYearlyRevenue(facilityIds);
                BigDecimal lastYearRevenue = revenueService.getLastYearRevenue(facilityIds);

                Long totalFacilities = revenueService.getTotalFacilities(facilityIds);
                Long totalBilliardTables = revenueService.getTotalBilliardTables(facilityIds);
                Long totalUsers = revenueService.getTotalUsers();

                // Phần trăm tăng trưởng
                BigDecimal todayIncreasePercentage = yesterdayRevenue.compareTo(BigDecimal.ZERO) > 0
                                ? todayRevenue.subtract(yesterdayRevenue).multiply(BigDecimal.valueOf(100))
                                                .divide(yesterdayRevenue, 2, BigDecimal.ROUND_HALF_UP)
                                : BigDecimal.ZERO;

                BigDecimal monthlyIncreasePercentage = lastMonthRevenue.compareTo(BigDecimal.ZERO) > 0
                                ? monthlyRevenue.subtract(lastMonthRevenue).multiply(BigDecimal.valueOf(100))
                                                .divide(lastMonthRevenue, 2, BigDecimal.ROUND_HALF_UP)
                                : BigDecimal.ZERO;

                BigDecimal yearlyIncreasePercentage = lastYearRevenue.compareTo(BigDecimal.ZERO) > 0
                                ? yearlyRevenue.subtract(lastYearRevenue).multiply(BigDecimal.valueOf(100))
                                                .divide(lastYearRevenue, 2, BigDecimal.ROUND_HALF_UP)
                                : BigDecimal.ZERO;

                response.put("todayRevenue", todayRevenue);
                response.put("yesterdayRevenue", yesterdayRevenue);
                response.put("todayIncreasePercentage", todayIncreasePercentage);

                response.put("monthlyRevenue", monthlyRevenue);
                response.put("lastMonthRevenue", lastMonthRevenue);
                response.put("monthlyIncreasePercentage", monthlyIncreasePercentage);

                response.put("yearlyRevenue", yearlyRevenue);
                response.put("lastYearRevenue", lastYearRevenue);
                response.put("yearlyIncreasePercentage", yearlyIncreasePercentage);

                response.put("totalFacilities", totalFacilities);
                response.put("totalBilliardTables", totalBilliardTables);
                response.put("totalUsers", totalUsers);

                // ✅ Doanh thu chi tiết từng Facility
                Map<String, BigDecimal> facilityRevenueMap = revenueService.getRevenueByFacility(facilityIds);
                response.put("facilityRevenue", facilityRevenueMap);

                return ResponseEntity.ok(response);
        }

        @GetMapping("/income-expense-summary")
        public ResponseEntity<?> getIncomeExpenseSummary(
                        @RequestParam("userId") Long userId,
                        @RequestParam("startDate") String startDateStr,
                        @RequestParam("endDate") String endDateStr) {
                LocalDate startDate = LocalDate.parse(startDateStr);
                LocalDate endDate = LocalDate.parse(endDateStr);

                Map<String, Double> summary = revenueService.getIncomeExpenseSummary(userId, startDate, endDate);

                return ResponseEntity.ok(summary);
        }

        @GetMapping("/monthly")
        public ResponseEntity<?> getMonthlyRevenueAndExpense(
                        @RequestParam int year,
                        @RequestParam(required = false) Long facilityId) {
                Map<String, Object> result = revenueService.getMonthlyRevenueAndExpense(year, facilityId);
                return ResponseEntity.ok(result);
        }

        @GetMapping("/top10-best-sellers")
        public ResponseEntity<?> getTop10BestSellers(
                        @RequestParam int month,
                        @RequestParam int year,
                        @RequestParam(required = false) Long facilityId) {
                Map<String, Object> result = revenueService.getTop10BestSellers(month, year, facilityId);
                return ResponseEntity.ok(result);
        }
}
