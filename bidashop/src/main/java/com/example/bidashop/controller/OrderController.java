package com.example.bidashop.controller;

import com.example.bidashop.dto.OrderRequestDTO;
import com.example.bidashop.model.Order;
import com.example.bidashop.model.TempTableSession;
import com.example.bidashop.repository.TempTableSessionRepository;
import com.example.bidashop.service.OrderService;
import com.example.bidashop.utils.ApiResponse;
import com.example.bidashop.utils.PaginationResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private TempTableSessionRepository tempTableSessionRepository;

    @Autowired
    private OrderService orderService;

    @GetMapping
    public ResponseEntity<ApiResponse<PaginationResponse<Order>>> getAllOrders(
            @RequestParam(required = false) Long orderId,
            @RequestParam(required = false) String customerName,
            @RequestParam(required = false) String phone,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) Long customerId,
            @RequestParam(required = false) Long staffId,
            @RequestParam(required = false) Long facilityId) {

        PaginationResponse<Order> orders = orderService.getAllOrders(orderId, customerName, phone, page, limit,
                customerId, facilityId, staffId);
        return ResponseEntity.ok(new ApiResponse<>(200, orders, "Lấy danh sách đơn hàng thành công"));
    }

    @GetMapping("/orders-by-customer")
    public ResponseEntity<ApiResponse<PaginationResponse<Order>>> getOrderByCustomerId(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam Long customerId) {

        // Gọi service để lấy đơn hàng của customerId
        PaginationResponse<Order> orders = orderService.getOrderByCustomerId(keyword, page, limit, customerId);

        return ResponseEntity.ok(new ApiResponse<>(200, orders, "Lấy danh sách đơn hàng của khách hàng thành công"));
    }
    @GetMapping("/check-payment")
    public ResponseEntity<?> checkPayment() {
        String url = "https://script.google.com/macros/s/AKfycbxLgKlONHE7mdLC2cIaLF7PW1Bj5WRl-0wwvB_mN6iv-0YnLJVJzpWxJ73sG7CAFZVp/exec";
        try {
            RestTemplate restTemplate = new RestTemplate();
            String response = restTemplate.getForObject(url, String.class);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Lỗi khi gọi Google Apps Script: " + e.getMessage());
        }
    }
    @PostMapping("/")
    public ResponseEntity<ApiResponse<Order>> createOrder(@RequestBody OrderRequestDTO request) {
        try {
            // Lấy thông tin session từ sessionId
            Optional<TempTableSession> sessionOpt = tempTableSessionRepository.findById(request.getSessionId());
            if (sessionOpt.isEmpty()) {
                return ResponseEntity.status(404)
                        .body(new ApiResponse<>(404, null, "Không tìm thấy session"));
            }

            TempTableSession session = sessionOpt.get();

            // Kiểm tra trạng thái session
            if (!session.getStatus().equals("ACTIVE")) {
                return ResponseEntity.status(400)
                        .body(new ApiResponse<>(400, null, "Session không phải là ACTIVE"));
            }

            // Tạo đơn hàng mới từ session
            Order order = orderService.createOrderFromSession(session, request.getPaymentMethod(),
                    request.getRequestTotalAmount(), request.getPlayDuration(), request.getStaffId(),
                    request.getCustomerPhone());

            // Cập nhật trạng thái session thành DONE
            session.setStatus("DONE");
            tempTableSessionRepository.save(session);

            return ResponseEntity.status(201)
                    .body(new ApiResponse<>(201, order, "Tạo đơn hàng thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(new ApiResponse<>(500, null, "Lỗi khi tạo đơn hàng: " + e.getMessage()));
        }
    }
}
