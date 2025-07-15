package com.example.bidashop.repository;

import com.example.bidashop.model.TempTableSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TempTableSessionRepository extends JpaRepository<TempTableSession, Long> {

    // Tìm session theo ID của bàn và trạng thái
    Optional<TempTableSession> findByTableIdAndStatus(Long tableId, String status);
}

