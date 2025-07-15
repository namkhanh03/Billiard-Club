package com.example.bidashop.repository;

import com.example.bidashop.model.Pricing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface PricingRepository extends JpaRepository<Pricing, Long> {

    Page<Pricing> findByDescriptionContainingIgnoreCase(String description, Pageable pageable);
}
