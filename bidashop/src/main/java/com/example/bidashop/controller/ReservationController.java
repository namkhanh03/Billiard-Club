package com.example.bidashop.controller;

import com.example.bidashop.model.Reservation;
import com.example.bidashop.service.ReservationService;
import com.example.bidashop.utils.ApiResponse;
import com.example.bidashop.utils.PaginationResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @PostMapping
    public ResponseEntity<ApiResponse<Reservation>> createReservation(
            @RequestParam Long facilityId,
            @RequestParam Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime reservationTime,
            @RequestParam(defaultValue = "PENDING") String status) {
        Reservation created = reservationService.createReservation(reservationTime, status, userId, facilityId);
        return ResponseEntity.ok(new ApiResponse<>(200, created, "Tạo đặt lịch thành công"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PaginationResponse<Reservation>>> getAllReservations(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) Long facilityId,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) String status) {

        PaginationResponse<Reservation> reservations = reservationService.getAllReservations(
                keyword, page, limit, date, facilityId, userId, status);

        return ResponseEntity.ok(new ApiResponse<>(200, reservations, "Lấy danh sách đặt lịch thành công"));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Reservation>> changeStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        Reservation updated = reservationService.changeStatus(id, status);
        return ResponseEntity.ok(new ApiResponse<>(200, updated, "Cập nhật trạng thái thành công"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> cancelReservation(@PathVariable Long id) {
        reservationService.cancelReservation(id);
        return ResponseEntity.ok(new ApiResponse<>(200, null, "Hủy đặt lịch thành công"));
    }

}
