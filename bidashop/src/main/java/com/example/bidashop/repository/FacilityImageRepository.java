package com.example.bidashop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.example.bidashop.model.FacilityImage;

import jakarta.transaction.Transactional;

@Repository
public interface FacilityImageRepository extends JpaRepository<FacilityImage, Long> {
    @Modifying
    @Transactional // ✅ Thêm annotation này để đảm bảo có transaction khi xóa dữ liệu
    @Query("DELETE FROM FacilityImage fi WHERE fi.facility.id = :facilityId")
    void deleteByFacilityId(@Param("facilityId") Long facilityId);
}
