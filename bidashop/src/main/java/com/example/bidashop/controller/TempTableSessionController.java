package com.example.bidashop.controller;

import com.example.bidashop.dto.TempTableSessionRequestDTO;
import com.example.bidashop.model.TempTableSession;
import com.example.bidashop.repository.TempTableSessionRepository;
import com.example.bidashop.service.TempTableSessionService;
import com.example.bidashop.utils.ApiResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@RestController
@RequestMapping("/api/temp-sessions")
public class TempTableSessionController {

    @Autowired
    private TempTableSessionService sessionService;

    @Autowired
    private TempTableSessionRepository tempTableSessionRepository;

    // ✅ Lấy session theo tableId
    @GetMapping("/by-table/{tableId}")
    public ResponseEntity<ApiResponse<TempTableSession>> getTempTableSessionByTableId(@PathVariable Long tableId) {
        Optional<TempTableSession> session = sessionService.getTempSessionByTableId(tableId);

        if (session.isPresent()) {
            return ResponseEntity.ok(new ApiResponse<>(200, session.get(), "Lấy thông tin session thành công"));
        } else {
            return ResponseEntity.status(404).body(new ApiResponse<>(404, null, "Không tìm thấy session cho bàn này"));
        }
    }

    // ✅ Tạo session mới (mở bàn)
    @PostMapping
    public ResponseEntity<ApiResponse<TempTableSession>> createTempTableSession(
            @RequestBody TempTableSessionRequestDTO request) {
        try {
            TempTableSession session = sessionService.createOrUpdateFromDTO(request);
            return ResponseEntity.status(201)
                    .body(new ApiResponse<>(201, session, "Mở bàn thành công"));
        } catch (ResponseStatusException ex) {
            return ResponseEntity.status(ex.getStatusCode())
                    .body(new ApiResponse<>(ex.getStatusCode().value(), null, ex.getReason()));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(new ApiResponse<>(500, null, "Lỗi khi mở bàn: " + e.getMessage()));
        }
    }

    // ✅ Cập nhật session (thêm món, chỉnh giờ,...)
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TempTableSession>> updateTempTableSession(
            @PathVariable Long id,
            @RequestBody TempTableSessionRequestDTO updatedRequest) {
        try {
            Optional<TempTableSession> existing = sessionService.getById(id);
            if (!existing.isPresent()) {
                return ResponseEntity.status(404)
                        .body(new ApiResponse<>(404, null, "Không tìm thấy session để cập nhật"));
            }

            TempTableSession updated = sessionService.updateFromDTO(id, updatedRequest);
            return ResponseEntity.ok(new ApiResponse<>(200, updated, "Cập nhật session thành công"));

        } catch (ResponseStatusException ex) {
            return ResponseEntity.status(ex.getStatusCode())
                    .body(new ApiResponse<>(ex.getStatusCode().value(), null, ex.getReason()));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(new ApiResponse<>(500, null, "Lỗi khi cập nhật session: " + e.getMessage()));
        }
    }

    @PostMapping("/{id}/increment-print")
    public ResponseEntity<ApiResponse<Void>> incrementPrintCount(@PathVariable Long id) {
        try {
            TempTableSession session = tempTableSessionRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy session"));

            // Tăng số lần in
            if (session.getPrintCount() == null) {
                session.setPrintCount(1);
            } else {
                session.setPrintCount(session.getPrintCount() + 1);
            }

            tempTableSessionRepository.save(session);
            return ResponseEntity.ok(new ApiResponse<>(200, null, "Số lần in được cập nhật thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(500, null, "Lỗi khi cập nhật số lần in"));
        }
    }
}
