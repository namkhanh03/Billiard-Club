package com.example.bidashop.repository;

import com.example.bidashop.model.Facility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;

@Repository
public interface FacilityRepository extends JpaRepository<Facility, Long> {

    // Tìm Facility theo ID và đảm bảo không bị xóa (isDelete = false)
    Optional<Facility> findByIdAndIsDeleteFalse(Long id);

    // Lấy tất cả các facility chưa bị xóa với phân trang
    Page<Facility> findByIsDeleteFalse(Pageable pageable);

    // Tìm Facility theo tên và đảm bảo không bị xóa (isDelete = false)
    Page<Facility> findByNameContainingAndIsDeleteFalse(String name, Pageable pageable);

    Page<Facility> findByIdInAndNameContainingAndIsDeleteFalse(List<Long> ids, String nameKeyword, Pageable pageable);

    // Tìm các chi nhánh có ID trong danh sách và chưa bị xóa (với phân trang)
    Page<Facility> findByIdInAndIsDeleteFalse(List<Long> ids, Pageable pageable);
    List<Facility> findByIsDeleteFalse();
    Long countByIdInAndIsDeleteFalse(List<Long> ids);
    List<Facility> findByIdInAndIsDeleteFalse(List<Long> ids);


}
