package com.example.bidashop.repository;

import com.example.bidashop.model.Reservation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    // CUSTOMER
    Page<Reservation> findAllByBookingBy_UserId(Long userId, Pageable pageable);

    // ADMIN + filter theo facilityId và ngày
    Page<Reservation> findAllByFacility_IdAndReservationTimeBetween(
            Long facilityId, LocalDateTime start, LocalDateTime end, Pageable pageable);

    // MANAGER + nhiều facilityId
    Page<Reservation> findAllByFacility_IdIn(List<Long> facilityIds, Pageable pageable);

    Page<Reservation> findAllByFacility_IdInAndReservationTimeBetween(
            List<Long> facilityIds, LocalDateTime start, LocalDateTime end, Pageable pageable);

    List<Reservation> findByFacility_IdAndReservationTimeBetween(Long facilityId, LocalDateTime start,
            LocalDateTime end);

    // ADMIN all
    Page<Reservation> findAll(Pageable pageable);

    @Query("SELECT r FROM Reservation r " +
            "WHERE (:facilityId IS NULL OR r.facility.id = :facilityId) " +
            "AND (:start IS NULL OR r.reservationTime >= :start) " +
            "AND (:end IS NULL OR r.reservationTime <= :end) " +
            "AND (:status IS NULL OR r.status = :status) " +
            "AND (:keyword IS NULL OR " +
            "LOWER(r.bookingBy.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR r.bookingBy.phoneNumber LIKE CONCAT('%', :keyword, '%'))")
    Page<Reservation> filterReservationsForAdmin(
            @Param("facilityId") Long facilityId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end,
            @Param("keyword") String keyword,
            @Param("status") String status,
            Pageable pageable);

    @Query("SELECT r FROM Reservation r " +
            "WHERE r.facility.id IN :facilityIds " +
            "AND (:start IS NULL OR r.reservationTime >= :start) " +
            "AND (:end IS NULL OR r.reservationTime <= :end) " +
            "AND (:status IS NULL OR r.status = :status) " +
            "AND (:keyword IS NULL OR " +
            "LOWER(r.bookingBy.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR r.bookingBy.phoneNumber LIKE CONCAT('%', :keyword, '%'))")
    Page<Reservation> filterReservationsForManager(
            @Param("facilityIds") List<Long> facilityIds,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end,
            @Param("keyword") String keyword,
            @Param("status") String status,
            Pageable pageable);

}
