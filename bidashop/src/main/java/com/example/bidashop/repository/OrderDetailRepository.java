package com.example.bidashop.repository;

import com.example.bidashop.model.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> {

    // Tìm OrderDetail theo OrderId
    List<OrderDetail> findByOrderId(Long orderId);

    // Tìm OrderDetail theo DrinkId
    List<OrderDetail> findByDrinkId(Long drinkId);

    // Tìm OrderDetail theo OrderId và DrinkId
    List<OrderDetail> findByOrderIdAndDrinkId(Long orderId, Long drinkId);
}
