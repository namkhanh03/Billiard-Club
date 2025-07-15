package com.example.bidashop.repository;

import com.example.bidashop.model.BilliardTable;
import com.example.bidashop.model.Facility;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BilliardTableRepository extends JpaRepository<BilliardTable, Long> {
    // Lấy tất cả bàn bi-a chưa bị xóa
    Page<BilliardTable> findByIsDeleteFalse(Pageable pageable);

    // Lọc theo từ khóa
    Page<BilliardTable> findByNameContainingAndIsDeleteFalse(String name, Pageable pageable);

    // Lọc theo facilityId
    Page<BilliardTable> findByFacilityIdAndIsDeleteFalse(Long facilityId, Pageable pageable);

    // Lọc theo từ khóa và facilityId
    Page<BilliardTable> findByNameContainingAndFacilityIdAndIsDeleteFalse(String name, Long facilityId, Pageable pageable);

    // Lọc theo nhiều facilityId và từ khóa
    Page<BilliardTable> findByFacilityIdInAndNameContainingAndIsDeleteFalse(List<Long> facilityIds, String name, Pageable pageable);

    // Lọc theo nhiều facilityId
    Page<BilliardTable> findByFacilityIdInAndIsDeleteFalse(List<Long> facilityIds, Pageable pageable);

    List<BilliardTable> findAllByFacility(Facility facility);
    Long countByFacilityIdInAndIsDeleteFalse(List<Long> facilityIds);
}
