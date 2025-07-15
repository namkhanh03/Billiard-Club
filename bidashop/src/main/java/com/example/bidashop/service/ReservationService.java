package com.example.bidashop.service;

import com.example.bidashop.model.Reservation;
import com.example.bidashop.model.User;
import com.example.bidashop.model.Facility;
import com.example.bidashop.repository.ReservationRepository;
import com.example.bidashop.repository.UserRepository;
import com.example.bidashop.repository.FacilityRepository;
import com.example.bidashop.utils.PaginationResponse;

import jakarta.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private FacilityRepository facilityRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JavaMailSender mailSender;

    public PaginationResponse<Reservation> getAllReservations(
            String keyword, int page, int limit, LocalDate dateFilter,
            Long facilityId, Long userId, String status) {

        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by("createdAt").descending());
        Page<Reservation> reservationPage;

        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return emptyPagination(page, limit);
        }

        User user = userOptional.get();
        List<Long> managedFacilityIds = user.getManagedFacilities().stream()
                .map(fu -> fu.getFacility().getId())
                .toList();

        boolean isAdmin = "ADMIN".equals(user.getRole().name());
        boolean isManager = "MANAGER".equals(user.getRole().name());
        boolean isCustomer = "CUSTOMER".equals(user.getRole().name());

        LocalDateTime startOfDay = dateFilter != null ? dateFilter.atStartOfDay() : null;
        LocalDateTime endOfDay = dateFilter != null ? dateFilter.plusDays(1).atStartOfDay().minusNanos(1) : null;

        if (isCustomer) {
            reservationPage = reservationRepository.findAllByBookingBy_UserId(userId, pageable);
        } else if (isAdmin) {
            reservationPage = reservationRepository.filterReservationsForAdmin(
                    facilityId, startOfDay, endOfDay, keyword, status, pageable);
        } else if (isManager) {
            if (managedFacilityIds.isEmpty()) {
                reservationPage = Page.empty(pageable);
            } else {
                reservationPage = reservationRepository.filterReservationsForManager(
                        managedFacilityIds, startOfDay, endOfDay, keyword, status, pageable);
            }
        } else {
            reservationPage = Page.empty(pageable);
        }

        PaginationResponse<Reservation> response = new PaginationResponse<>();
        response.setContent(reservationPage.getContent());
        response.setPage(page);
        response.setLimit(limit);
        response.setTotalElements(reservationPage.getTotalElements());
        response.setTotalPages(reservationPage.getTotalPages());

        return response;
    }

    public Reservation createReservation(LocalDateTime reservationTime, String status,
            Long userId, Long facilityId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User không tồn tại"));

        Facility facility = facilityRepository.findById(facilityId)
                .orElseThrow(() -> new IllegalArgumentException("Facility không tồn tại"));

        // 📌 Kiểm tra trùng lịch (±1 giờ)
        LocalDateTime start = reservationTime.minusHours(1);
        LocalDateTime end = reservationTime.plusHours(1);

        List<Reservation> overlapping = reservationRepository.findByFacility_IdAndReservationTimeBetween(
                facilityId, start, end);
        if (!overlapping.isEmpty()) {
            throw new IllegalStateException("Khung giờ này đã có người đặt");
        }

        // ✅ Tạo mới
        Reservation reservation = new Reservation();
        reservation.setReservationTime(reservationTime);
        reservation.setStatus(status);
        reservation.setCreatedAt(LocalDateTime.now());
        reservation.setUpdatedAt(LocalDateTime.now());
        reservation.setBookingBy(user);
        reservation.setFacility(facility);

        Reservation saved = reservationRepository.save(reservation);

        // 📧 Gửi email xác nhận
        String imageUrl = facility.getImages().isEmpty()
                ? "https://your-default-image-url.com/default.jpg"
                : facility.getImages().get(0).getImageUrl();

        sendConfirmationEmail(user.getEmail(), user.getFullName(), reservationTime, facility.getName(),
                facility.getAddress(), imageUrl);

        return saved;
    }

    private void sendConfirmationEmail(String toEmail, String userName, LocalDateTime time, String facilityName,
            String facilityAddress, String facilityImageUrl) {
        String subject = "Xác nhận đặt lịch tại " + facilityName;
        String formattedTime = time.format(DateTimeFormatter.ofPattern("HH:mm dd/MM/yyyy"));

        String mapLink = "https://www.google.com/maps/search/?api=1&query=" +
                URLEncoder.encode(facilityAddress, StandardCharsets.UTF_8);

        String content = "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; " +
                "border: 1px solid #ddd; border-radius: 8px; overflow: hidden;'>"
                + "<img src='" + facilityImageUrl
                + "' alt='Facility Image' style='width: 100%; height: auto; max-height: 300px; object-fit: cover;'/>"
                + "<div style='padding: 20px;'>"
                + "<h2 style='color: #ff7b1d;'>Xác nhận đặt lịch thành công</h2>"
                + "<p>Xin chào <strong>" + userName + "</strong>,</p>"
                + "<p>Bạn đã đặt lịch thành công tại chi nhánh <strong style='color: #ff7b1d;'>" + facilityName
                + "</strong>.</p>"
                + "<p><strong>Thời gian:</strong> " + formattedTime + "</p>"
                + "<p><strong>Địa chỉ:</strong> <a href='" + mapLink
                + "' target='_blank' style='color: #ff7b1d; text-decoration: underline;'>"
                + facilityAddress + "</a></p>"
                + "<p style='margin-top: 20px;'>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.</p>"
                + "<hr style='border: none; border-top: 1px solid #ccc;'/>"
                + "<p style='font-size: 0.85rem; color: #888;'>Đây là email tự động, vui lòng không trả lời email này.</p>"
                + "</div></div>";

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(content, true);

            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Không thể gửi email xác nhận: " + e.getMessage());
        }
    }

    private PaginationResponse<Reservation> emptyPagination(int page, int limit) {
        PaginationResponse<Reservation> response = new PaginationResponse<>();
        response.setContent(Collections.emptyList());
        response.setPage(page);
        response.setLimit(limit);
        response.setTotalElements(0L);
        response.setTotalPages(0);
        return response;
    }

    public Reservation changeStatus(Long id, String status) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Reservation không tồn tại"));
        reservation.setStatus(status.toUpperCase());
        reservation.setUpdatedAt(LocalDateTime.now());
        return reservationRepository.save(reservation);
    }

    public void cancelReservation(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Reservation không tồn tại"));
        reservation.setStatus("CANCEL");
        reservation.setUpdatedAt(LocalDateTime.now());
        reservationRepository.save(reservation);
    }

}
