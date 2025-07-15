package com.example.bidashop.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import com.example.bidashop.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.bidashop.model.Facility;
import com.example.bidashop.model.Order;
import com.example.bidashop.repository.FacilityRepository;
import com.example.bidashop.repository.FacilityUserRepository;
import com.example.bidashop.repository.IncomeExpenseRepository;
import com.example.bidashop.repository.OrderRepository;
import com.example.bidashop.repository.UserRepository;
import com.example.bidashop.repository.BilliardTableRepository;

@Service
public class RevenueService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private FacilityRepository facilityRepository;

    @Autowired
    private IncomeExpenseRepository incomeExpenseRepository;

    @Autowired
    private FacilityUserRepository facilityUserRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BilliardTableRepository billiardTableRepository;

    public List<Long> getAllFacilityIds() {
        return facilityRepository.findAll()
                .stream()
                .filter(f -> !f.getIsDelete())
                .map(Facility::getId)
                .collect(Collectors.toList());
    }

    public List<Long> getFacilityIdsManagedByUser(Long userId) {
        return facilityUserRepository.findByUserId(userId)
                .stream()
                .map(fu -> fu.getFacility().getId())
                .collect(Collectors.toList());
    }

    public BigDecimal getTodayRevenue(List<Long> facilityIds) {
        LocalDate today = LocalDate.now();
        return getRevenueBetweenDates(today.atStartOfDay(), today.plusDays(1).atStartOfDay(), facilityIds);
    }

    public BigDecimal getYesterdayRevenue(List<Long> facilityIds) {
        LocalDate yesterday = LocalDate.now().minusDays(1);
        return getRevenueBetweenDates(yesterday.atStartOfDay(), yesterday.plusDays(1).atStartOfDay(), facilityIds);
    }

    public BigDecimal getMonthRevenue(List<Long> facilityIds) {
        YearMonth thisMonth = YearMonth.now();
        return getRevenueBetweenDates(
                thisMonth.atDay(1).atStartOfDay(),
                thisMonth.plusMonths(1).atDay(1).atStartOfDay(),
                facilityIds);
    }

    public BigDecimal getLastMonthRevenue(List<Long> facilityIds) {
        YearMonth lastMonth = YearMonth.now().minusMonths(1);
        return getRevenueBetweenDates(
                lastMonth.atDay(1).atStartOfDay(),
                lastMonth.plusMonths(1).atDay(1).atStartOfDay(),
                facilityIds);
    }

    public BigDecimal getYearlyRevenue(List<Long> facilityIds) {
        LocalDate firstDay = LocalDate.now().withDayOfYear(1);
        return getRevenueBetweenDates(firstDay.atStartOfDay(), firstDay.plusYears(1).atStartOfDay(), facilityIds);
    }

    public BigDecimal getLastYearRevenue(List<Long> facilityIds) {
        LocalDate firstDay = LocalDate.now().minusYears(1).withDayOfYear(1);
        return getRevenueBetweenDates(firstDay.atStartOfDay(), firstDay.plusYears(1).atStartOfDay(), facilityIds);
    }

    private BigDecimal getRevenueBetweenDates(
            java.time.LocalDateTime startDateTime,
            java.time.LocalDateTime endDateTime,
            List<Long> facilityIds) {
        List<Order> orders = orderRepository.findByCreatedAtBetween(startDateTime, endDateTime);
        return orders.stream()
                .filter(o -> o.getTable() != null)
                .filter(o -> facilityIds.contains(o.getTable().getFacility().getId()))
                .map(o -> o.getTotalAmount() == null ? BigDecimal.ZERO : BigDecimal.valueOf(o.getTotalAmount()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public Long getTotalFacilities(List<Long> facilityIds) {
        return facilityRepository.countByIdInAndIsDeleteFalse(facilityIds);
    }

    public Long getTotalBilliardTables(List<Long> facilityIds) {
        return billiardTableRepository.countByFacilityIdInAndIsDeleteFalse(facilityIds);
    }

    public Long getTotalUsers() {
        return userRepository.countByRoleAndIsDeleteFalse(User.Role.CUSTOMER);
    }

    public Map<String, BigDecimal> getRevenueByFacility(List<Long> facilityIds) {
        Map<String, BigDecimal> result = new HashMap<>();

        // Chỉ lấy các Facility có id thuộc facilityIds và isDelete = false
        List<Facility> facilities = facilityRepository.findByIdInAndIsDeleteFalse(facilityIds);

        for (Facility facility : facilities) {
            List<Order> orders = orderRepository.findByTableFacilityId(facility.getId());
            BigDecimal revenue = orders.stream()
                    .map(o -> o.getTotalAmount() == null ? BigDecimal.ZERO : BigDecimal.valueOf(o.getTotalAmount()))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            result.put(facility.getName(), revenue);
        }
        return result;
    }

    public Map<String, Double> getIncomeExpenseSummary(Long userId, LocalDate startDate, LocalDate endDate) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Long> facilityIds;

        if (user.getRole() == User.Role.ADMIN) {
            facilityIds = facilityRepository.findAll()
                    .stream()
                    .filter(f -> !f.getIsDelete())
                    .map(Facility::getId)
                    .collect(Collectors.toList());
        } else {
            facilityIds = facilityUserRepository.findByUserId(userId)
                    .stream()
                    .map(fu -> fu.getFacility().getId())
                    .collect(Collectors.toList());
        }

        // Tính tổng Income
        Double totalIncome = incomeExpenseRepository.sumAmountByTypeAndFacilityIdsAndDateRange(
                "Income", facilityIds, startDate, endDate);

        // Tính tổng Expense
        Double totalExpense = incomeExpenseRepository.sumAmountByTypeAndFacilityIdsAndDateRange(
                "Expense", facilityIds, startDate, endDate);

        Map<String, Double> result = new HashMap<>();
        result.put("totalIncome", totalIncome != null ? totalIncome : 0.0);
        result.put("totalExpense", totalExpense != null ? totalExpense : 0.0);

        return result;
    }

    public Map<String, Object> getMonthlyRevenueAndExpense(int year, Long facilityId) {
        List<Object[]> revenueData = orderRepository.findMonthlyRevenue(year, facilityId);
        List<Object[]> expenseData = incomeExpenseRepository.findMonthlyExpense(year, facilityId);

        Map<Integer, Long> revenueMap = revenueData.stream()
                .collect(Collectors.toMap(row -> (Integer) row[0], row -> ((Number) row[1]).longValue()));

        Map<Integer, Long> expenseMap = expenseData.stream()
                .collect(Collectors.toMap(row -> (Integer) row[0], row -> ((Number) row[1]).longValue()));

        List<String> categories = new ArrayList<>();
        List<Long> revenues = new ArrayList<>();
        List<Long> expenses = new ArrayList<>();

        for (int month = 1; month <= 12; month++) {
            categories.add("Tháng " + month);
            revenues.add(revenueMap.getOrDefault(month, 0L));
            expenses.add(expenseMap.getOrDefault(month, 0L));
        }

        Map<String, Object> result = new HashMap<>();
        result.put("categories", categories);
        result.put("series", List.of(
                Map.of("name", "Doanh thu", "data", revenues),
                Map.of("name", "Chi phí", "data", expenses)));
        return result;
    }

    public Map<String, Object> getTop10BestSellers(int month, int year, Long facilityId) {
        List<Object[]> rawData = orderRepository.findTop10BestSellers(month, year, facilityId);

        List<String> itemNames = new ArrayList<>();
        List<Long> quantities = new ArrayList<>();

        for (Object[] row : rawData) {
            itemNames.add((String) row[0]);
            quantities.add(((Number) row[1]).longValue());
        }

        Map<String, Object> result = new HashMap<>();
        result.put("categories", itemNames);
        result.put("series", List.of(
                Map.of("name", "Số lượng bán ra", "data", quantities)));
        return result;
    }

}
