package com.example.bidashop.service;

import com.example.bidashop.model.Order;
import com.example.bidashop.model.TempTableSession;
import com.example.bidashop.model.User;
import com.example.bidashop.model.OrderDetail;
import com.example.bidashop.repository.OrderRepository;
import com.example.bidashop.repository.UserRepository;
import com.example.bidashop.utils.PaginationResponse;
import com.example.bidashop.repository.OrderDetailRepository;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.*;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Autowired
    private UserRepository userRepository;

    public PaginationResponse<Order> getAllOrders(Long orderId, String customerName, String phone, int page, int limit,
            Long customerId, Long facilityId, Long staffId) {
        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by("createdAt").descending());

        // Log để debug
        System.out.println("🔍 [Order Search] orderId: " + orderId);
        System.out.println("🔍 [Order Search] customerName: " + customerName);
        System.out.println("🔍 [Order Search] phone: " + phone);

        // Chuyển chuỗi rỗng thành null
        if (customerName != null && customerName.trim().isEmpty()) {
            customerName = null;
        }
        if (phone != null && phone.trim().isEmpty()) {
            phone = null;
        }

        Optional<User> userOptional = userRepository.findById(staffId);
        if (userOptional.isEmpty()) {
            return getPaginationResponse(orderRepository.findAll(pageable), page, limit);
        }

        User user = userOptional.get();
        String role = user.getRole().toString();

        if ("ADMIN".equals(role) || "MANAGER".equals(role) || "CUSTOMER".equals(role)) {
            // Cho phép tìm theo từng field riêng biệt
            if (orderId != null || customerName != null || phone != null) {
                return getPaginationResponse(
                        orderRepository.advancedSearch(orderId, customerName, phone, facilityId, pageable),
                        page, limit);
            }

            if (customerId != null && facilityId != null) {
                return getPaginationResponse(
                        orderRepository.findByCustomerIdAndFacilityId(customerId, facilityId, pageable),
                        page, limit);
            }

            if (facilityId != null) {
                return getPaginationResponse(
                        orderRepository.findByCustomerIdAndFacilityId(null, facilityId, pageable),
                        page, limit);
            }

            return getPaginationResponse(orderRepository.findAll(pageable), page, limit);
        }

        if ("STAFF".equals(role)) {
            if (facilityId != null) {
                return getPaginationResponse(
                        orderRepository.findByStaffIdAndFacilityId(staffId, facilityId, pageable),
                        page, limit);
            } else {
                return getPaginationResponse(orderRepository.findByStaffId(staffId, pageable), page, limit);
            }
        }

        return getPaginationResponse(orderRepository.findAll(pageable), page, limit);
    }

    public PaginationResponse<Order> getOrderByCustomerId(String keyword, int page, int limit, Long customerId) {
        // Kiểm tra xem customerId có hợp lệ không
        if (customerId == null) {
            throw new IllegalArgumentException("Customer ID must not be null");
        }

        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by("createdAt").descending());

        // Nếu keyword có, tìm kiếm theo từ khóa
        if (keyword != null && !keyword.isEmpty()) {
            return getPaginationResponse(orderRepository.searchOrders(keyword, null, pageable), page, limit);
        }

        // Nếu chỉ có customerId, lấy đơn hàng của customer đó
        return getPaginationResponse(orderRepository.findByCustomerId(customerId, pageable), page, limit);
    }

    private PaginationResponse<Order> getPaginationResponse(Page<Order> orderPage, int page, int limit) {
        PaginationResponse<Order> response = new PaginationResponse<>();
        response.setContent(orderPage.getContent());
        response.setPage(page);
        response.setLimit(limit);
        response.setTotalElements(orderPage.getTotalElements());
        response.setTotalPages(orderPage.getTotalPages());

        return response;
    }

    public Order createOrderFromSession(
            TempTableSession session,
            String paymentMethod,
            Integer requestTotalAmount,
            Long playDuration,
            Long staffId,
            String customerPhone) {

        // Tìm nhân viên thanh toán
        User staff = userRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên với ID: " + staffId));

        // Ưu tiên lấy SĐT từ session, nếu null thì lấy từ tham số
        String finalCustomerPhone = session.getCustomerPhone() != null
                ? session.getCustomerPhone()
                : customerPhone;

        // Tìm khách hàng theo số điện thoại
        User customer = userRepository.findByPhoneNumber(finalCustomerPhone).orElse(null);

        // Tạo đơn hàng
        Order order = new Order();
        order.setCustomerPhone(finalCustomerPhone);
        order.setCustomer(customer); // null nếu không tìm thấy
        order.setTable(session.getTable());
        order.setStartTime(session.getStartTime());
        order.setEndTime(session.getEndTime());
        order.setPaymentMethod(paymentMethod);
        order.setTotalAmount(requestTotalAmount);
        order.setPlayDuration(playDuration);
        order.setStaff(staff);

        // Lưu đơn hàng
        orderRepository.save(order);

        // Lưu từng món uống
        session.getDrinks().forEach(drinkItem -> {
            OrderDetail orderDetail = new OrderDetail();
            orderDetail.setOrder(order);
            orderDetail.setDrink(drinkItem.getDrink());
            orderDetail.setQuantity(drinkItem.getQuantity());
            orderDetail.setUnitPrice(drinkItem.getPriceAtThatTime());

            orderDetailRepository.save(orderDetail);
        });

        return order;
    }
}
