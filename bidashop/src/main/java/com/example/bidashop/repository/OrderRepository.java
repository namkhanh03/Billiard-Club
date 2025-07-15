package com.example.bidashop.repository;

import com.example.bidashop.model.Order;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

        // Truy vấn đơn hàng theo customerId và facilityId
        @Query("SELECT o FROM Order o WHERE " +
                        "(:customerId IS NULL OR o.customer.userId = :customerId) " +
                        "AND (:facilityId IS NULL OR o.table.facility.id = :facilityId)")
        Page<Order> findByCustomerIdAndFacilityId(Long customerId, Long facilityId, Pageable pageable);

        @Query("SELECT o FROM Order o " +
                "LEFT JOIN o.customer c " +
                "WHERE (:orderId IS NULL OR o.id = :orderId) " +
                "AND (:customerName IS NULL OR (c IS NOT NULL AND LOWER(c.fullName) LIKE LOWER(CONCAT('%', :customerName, '%')))) " +
                "AND (:phone IS NULL OR (" +
                "      (c IS NOT NULL AND c.phoneNumber LIKE CONCAT('%', :phone, '%')) " +
                "      OR (c IS NULL AND o.customerPhone IS NOT NULL AND o.customerPhone LIKE CONCAT('%', :phone, '%'))" +
                "     )) " +
                "AND (:facilityId IS NULL OR o.table.facility.id = :facilityId)")
        Page<Order> advancedSearch(@Param("orderId") Long orderId,
                                   @Param("customerName") String customerName,
                                   @Param("phone") String phone,
                                   @Param("facilityId") Long facilityId,
                                   Pageable pageable);


        @Query("SELECT o FROM Order o " +
                        "WHERE (:keyword IS NULL OR o.customer.fullName LIKE %:keyword% OR o.customer.email LIKE %:keyword% OR o.customer.phoneNumber LIKE %:keyword%) "
                        +
                        "AND (:facilityId IS NULL OR o.table.facility.id = :facilityId)")
        Page<Order> searchOrders(String keyword, Long facilityId, Pageable pageable);

        @Query("SELECT o FROM Order o WHERE o.staff.userId = :staffId")
        Page<Order> findByStaffId(Long staffId, Pageable pageable);

        @Query("SELECT o FROM Order o WHERE o.staff.userId = :staffId AND o.table.facility.id = :facilityId")
        Page<Order> findByStaffIdAndFacilityId(Long staffId, Long facilityId, Pageable pageable);

        @Query("SELECT o FROM Order o WHERE o.customer.userId = :customerId")
        Page<Order> findByCustomerId(@Param("customerId") Long customerId, Pageable pageable);

        @Query("SELECT o FROM Order o WHERE o.createdAt BETWEEN :startDate AND :endDate")
        List<Order> findByCreatedAtBetween(
                        @Param("startDate") LocalDateTime startDate,
                        @Param("endDate") LocalDateTime endDate);

        @Query("SELECT o FROM Order o WHERE o.table.facility.id = :facilityId")
        List<Order> findByTableFacilityId(
                        @Param("facilityId") Long facilityId);

        @Query("SELECT MONTH(o.createdAt) as month, SUM(o.totalAmount) as revenue " +
                        "FROM Order o WHERE YEAR(o.createdAt) = :year " +
                        "AND (:facilityId IS NULL OR o.table.facility.id = :facilityId) " +
                        "GROUP BY MONTH(o.createdAt)")
        List<Object[]> findMonthlyRevenue(@Param("year") int year, @Param("facilityId") Long facilityId);

        @Query("""
                            SELECT d.drink.name, SUM(d.quantity) as totalQuantity
                            FROM OrderDetail d
                            JOIN d.order o
                            WHERE FUNCTION('MONTH', o.createdAt) = :month
                              AND FUNCTION('YEAR', o.createdAt) = :year
                              AND (:facilityId IS NULL OR o.table.facility.id = :facilityId)
                            GROUP BY d.drink.name
                            ORDER BY totalQuantity DESC
                        """)
        List<Object[]> findTop10BestSellers(@Param("month") int month,
                        @Param("year") int year,
                        @Param("facilityId") Long facilityId);
}
