package com.example.bidashop.repository;

import com.example.bidashop.model.DrinkFood;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DrinkFoodRepository extends JpaRepository<DrinkFood, Long> {
        Page<DrinkFood> findByIsDeleteFalse(Pageable pageable);

        Page<DrinkFood> findByNameContainingAndIsDeleteFalse(String keyword, Pageable pageable);

        Page<DrinkFood> findByCategoryIdAndIsDeleteFalse(Long categoryId, Pageable pageable);

        Page<DrinkFood> findByNameContainingAndCategoryIdAndIsDeleteFalse(String keyword, Long categoryId,
                        Pageable pageable);

        Optional<DrinkFood> findByName(String name);

        Page<DrinkFood> findByNameContainingAndCategoryIdAndFacilityIdAndIsDeleteFalse(String keyword, Long categoryId,
                        Long facilityId, Pageable pageable);

        Page<DrinkFood> findByNameContainingAndFacilityIdAndIsDeleteFalse(String keyword, Long facilityId,
                        Pageable pageable);

        Page<DrinkFood> findByCategoryIdAndFacilityIdAndIsDeleteFalse(Long categoryId, Long facilityId,
                        Pageable pageable);

        Page<DrinkFood> findByFacilityIdAndIsDeleteFalse(Long facilityId, Pageable pageable);

        Page<DrinkFood> findByFacilityIdInAndIsDeleteFalse(List<Long> facilityIds, Pageable pageable);

        Page<DrinkFood> findByCategoryIdAndFacilityIdInAndIsDeleteFalse(Long categoryId, List<Long> facilityIds,
                        Pageable pageable);

        Page<DrinkFood> findByNameContainingAndFacilityIdInAndIsDeleteFalse(String name, List<Long> facilityIds,
                        Pageable pageable);

        Page<DrinkFood> findByNameContainingAndCategoryIdAndFacilityIdInAndIsDeleteFalse(String name, Long categoryId,
                        List<Long> facilityIds, Pageable pageable);

        Optional<DrinkFood> findByNameAndIsDeleteFalse(String name);

}
