package com.example.bidashop.repository;

import com.example.bidashop.model.IncomeExpense;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface IncomeExpenseRepository extends JpaRepository<IncomeExpense, Long> {

        // Calculate total income in the date range
        @Query("SELECT SUM(i.amount) FROM IncomeExpense i WHERE i.type = 'Income' AND i.date BETWEEN :fromDate AND :toDate AND i.isDelete = false")
        Double calculateTotalIncome(LocalDate fromDate, LocalDate toDate);

        // Calculate total expense in the date range
        @Query("SELECT SUM(i.amount) FROM IncomeExpense i WHERE i.type = 'Expense' AND i.date BETWEEN :fromDate AND :toDate AND i.isDelete = false")
        Double calculateTotalExpense(LocalDate fromDate, LocalDate toDate);

        @Query("SELECT i FROM IncomeExpense i WHERE i.facility.id IN :facilityIds AND i.type = :type " +
                        "AND (i.date = :date OR :date IS NULL) AND i.isDelete = false")
        Page<IncomeExpense> findByFacilityIdInAndTypeAndDateAndIsDeleteFalse(List<Long> facilityIds, String type,
                        LocalDate date, Pageable pageable);

        @Query("SELECT i FROM IncomeExpense i WHERE i.type = :type AND (i.date = :date OR :date IS NULL) " +
                        "AND i.isDelete = false")
        Page<IncomeExpense> findAllByTypeAndDateAndIsDeleteFalse(String type, LocalDate date, Pageable pageable);

        @Query("SELECT i FROM IncomeExpense i WHERE (i.date = :date OR :date IS NULL) AND i.isDelete = false")
        Page<IncomeExpense> findAllByDateAndIsDeleteFalse(LocalDate date, Pageable pageable);

        @Query("SELECT i FROM IncomeExpense i WHERE i.facility.id IN :facilityIds AND i.type = :type " +
                        "AND i.isDelete = false")
        Page<IncomeExpense> findByFacilityIdInAndTypeAndIsDeleteFalse(List<Long> facilityIds, String type,
                        Pageable pageable);

        @Query("SELECT i FROM IncomeExpense i WHERE i.facility.id IN :facilityIds AND i.type = :type " +
                        "AND (i.date = :date OR :date IS NULL) AND i.isDelete = false")
        Page<IncomeExpense> findByFacilityIdInAndTypeAndCreatedAtAndIsDeleteFalse(List<Long> facilityIds, String type,
                        LocalDate date, Pageable pageable);

        // Find by facilityId in and createdAt and isDelete = false
        Page<IncomeExpense> findByFacilityIdInAndCreatedAtAndIsDeleteFalse(List<Long> facilityIds, LocalDate date,
                        Pageable pageable);

        // Find all by type and createdAt and isDelete = false
        @Query("SELECT i FROM IncomeExpense i WHERE i.type = :type AND (i.date = :date OR :date IS NULL) " +
                        "AND i.isDelete = false")
        Page<IncomeExpense> findAllByTypeAndCreatedAtAndIsDeleteFalse(String type, LocalDate date,
                        Pageable pageable);

        @Query("SELECT i FROM IncomeExpense i WHERE (i.date = :date OR :date IS NULL) AND i.isDelete = false")
        Page<IncomeExpense> findAllByCreatedAtAndIsDeleteFalse(LocalDate date, Pageable pageable);

        Page<IncomeExpense> findAllByTypeAndIsDeleteFalse(String type, Pageable pageable);

        // General filter by deletion status (no type)
        Page<IncomeExpense> findAllByIsDeleteFalse(Pageable pageable);

        // Filter by facilityIds and isDelete status (without type filter)
        Page<IncomeExpense> findByFacilityIdInAndIsDeleteFalse(List<Long> facilityIds, Pageable pageable);

        @Query("SELECT i FROM IncomeExpense i WHERE i.facility.id IN :facilityIds AND i.type = :type " +
                        "AND (i.date = :date OR :date IS NULL) AND (i.description LIKE %:keyword% OR :keyword IS NULL) "
                        +
                        "AND i.isDelete = false")
        Page<IncomeExpense> findByFacilityIdInAndTypeAndCreatedAtAndKeywordAndIsDeleteFalse(List<Long> facilityIds,
                        String type, String keyword, LocalDate date, Pageable pageable);

        @Query("SELECT i FROM IncomeExpense i WHERE i.facility.id IN :facilityIds AND i.date = :date AND i.isDelete = false")
        Page<IncomeExpense> findByFacilityIdInAndDateAndIsDeleteFalse(List<Long> facilityIds, LocalDate date,
                        Pageable pageable);

        @Query("SELECT SUM(ie.amount) FROM IncomeExpense ie " +
                        "WHERE ie.type = :type " +
                        "AND ie.facility.id IN :facilityIds " +
                        "AND ie.isDelete = false " +
                        "AND ie.date BETWEEN :startDate AND :endDate")
        Double sumAmountByTypeAndFacilityIdsAndDateRange(
                        @Param("type") String type,
                        @Param("facilityIds") List<Long> facilityIds,
                        @Param("startDate") LocalDate startDate,
                        @Param("endDate") LocalDate endDate);

        @Query("SELECT MONTH(ie.date) as month, SUM(ie.amount) as expense " +
                        "FROM IncomeExpense ie WHERE ie.type = 'Expense' " +
                        "AND YEAR(ie.date) = :year " +
                        "AND ie.isDelete = false " +
                        "AND (:facilityId IS NULL OR ie.facility.id = :facilityId) " +
                        "GROUP BY MONTH(ie.date)")
        List<Object[]> findMonthlyExpense(@Param("year") int year, @Param("facilityId") Long facilityId);

}
