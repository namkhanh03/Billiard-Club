package com.example.bidashop.service;

import com.example.bidashop.dto.TempTableSessionRequestDTO;
import com.example.bidashop.model.DrinkFood;
import com.example.bidashop.model.TempDrinkItem;
import com.example.bidashop.model.TempTableSession;
import com.example.bidashop.repository.BilliardTableRepository;
import com.example.bidashop.repository.DrinkFoodRepository;
import com.example.bidashop.repository.TempTableSessionRepository;
import com.example.bidashop.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TempTableSessionService {

    @Autowired
    private TempTableSessionRepository tempTableSessionRepository;

    @Autowired
    private BilliardTableRepository billiardTableRepository;
    @Autowired
    private DrinkFoodRepository drinkFoodRepository;

    @Autowired
    private UserRepository userRepository;

    public Optional<TempTableSession> getTempSessionByTableId(Long tableId) {
        return tempTableSessionRepository.findByTableIdAndStatus(tableId, "ACTIVE");
    }

    public TempTableSession createOrUpdateFromDTO(TempTableSessionRequestDTO dto) {
        // 1. Tìm session ACTIVE của bàn nếu có
        Optional<TempTableSession> existingOpt = tempTableSessionRepository
                .findByTableIdAndStatus(dto.getTableId(), "ACTIVE");

        TempTableSession session = existingOpt.orElse(new TempTableSession());

        // 2. Gán lại thông tin bàn
        session.setTable(billiardTableRepository.findById(dto.getTableId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bàn")));

        // 3. Gán thông tin khách (nếu có)
        if (dto.getCustomerId() != null) {
            session.setCustomer(userRepository.findById(dto.getCustomerId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng")));
        } else {
            session.setCustomer(null);
        }

        // 4. Thời gian bắt đầu và kết thúc (chuyển về UTC+7)
        if (dto.getStartTime() != null) {
            ZonedDateTime startTimeInUTC7 = dto.getStartTime()
                    .atZone(ZoneId.of("UTC"))
                    .plusHours(7);
            session.setStartTime(startTimeInUTC7.toLocalDateTime());
        }

        if (dto.getEndTime() != null) {
            ZonedDateTime endTimeInUTC7 = dto.getEndTime()
                    .atZone(ZoneId.of("UTC"))
                    .plusHours(7);
            session.setEndTime(endTimeInUTC7.toLocalDateTime());
        }

        session.setStatus(dto.getStatus());
        session.setCustomerPhone(dto.getCustomerPhone());

        // 5. Xóa danh sách drinks cũ nếu có (khi update)
        if (session.getDrinks() != null) {
            session.getDrinks().clear();
        }

        // 6. Tạo danh sách drinks mới & kiểm tra số lượng tồn kho
        List<TempDrinkItem> drinks = dto.getDrinks().stream().map(d -> {
            DrinkFood drinkFood = drinkFoodRepository.findById(d.getDrinkId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy món"));

            // Kiểm tra số lượng tồn kho
            if (drinkFood.getQuantity() < d.getQuantity()) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Món '" + drinkFood.getName() + "' không đủ số lượng. Còn lại: " + drinkFood.getQuantity());
            }

            // Tạo item
            TempDrinkItem item = new TempDrinkItem();
            item.setDrink(drinkFood);
            item.setQuantity(d.getQuantity());
            item.setPriceAtThatTime(d.getUnitPrice());
            item.setSession(session);

            // Trừ số lượng
            drinkFood.setQuantity(drinkFood.getQuantity() - d.getQuantity());
            drinkFoodRepository.save(drinkFood);

            return item;
        }).collect(Collectors.toList());

        // 7. Gán vào session & lưu
        session.setDrinks(drinks);

        return tempTableSessionRepository.save(session);
    }

    public TempTableSession updateFromDTO(Long id, TempTableSessionRequestDTO dto) {
        TempTableSession session = tempTableSessionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy session"));

        if (dto.getCustomerId() != null) {
            session.setCustomer(userRepository.findById(dto.getCustomerId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng")));
        }
        if (dto.getStartTime() != null) {
            ZonedDateTime startTimeInUTC7 = dto.getStartTime().atZone(ZoneId.of("UTC")).plusHours(7);
            session.setStartTime(startTimeInUTC7.toLocalDateTime());
        }
        if (dto.getEndTime() != null) {
            ZonedDateTime endTimeInUTC7 = dto.getEndTime().atZone(ZoneId.of("UTC")).plusHours(7);
            session.setEndTime(endTimeInUTC7.toLocalDateTime());
        }

        session.setStatus(dto.getStatus());
        session.setCustomerPhone(dto.getCustomerPhone());

        // Lưu map các món cũ để xử lý logic
        Map<Long, Integer> oldDrinkQuantities = session.getDrinks().stream()
                .collect(Collectors.toMap(
                        item -> item.getDrink().getId(),
                        TempDrinkItem::getQuantity));

        List<TempDrinkItem> drinks = dto.getDrinks().stream().map(d -> {
            DrinkFood drinkFood = drinkFoodRepository.findById(d.getDrinkId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy món"));

            int oldQuantity = oldDrinkQuantities.getOrDefault(d.getDrinkId(), 0);
            int diff = d.getQuantity() - oldQuantity;

            // Nếu tăng số lượng và không đủ hàng → báo lỗi
            if (diff > 0 && drinkFood.getQuantity() < diff) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Món '" + drinkFood.getName() + "' không đủ số lượng. Còn lại: " + drinkFood.getQuantity());
            }

            // Cập nhật số lượng kho
            drinkFood.setQuantity(drinkFood.getQuantity() - diff);
            drinkFoodRepository.save(drinkFood);

            // Tạo item
            TempDrinkItem item = new TempDrinkItem();
            item.setDrink(drinkFood);
            item.setQuantity(d.getQuantity());
            item.setPriceAtThatTime(d.getUnitPrice());
            item.setSession(session);

            return item;
        }).collect(Collectors.toList());

        // Hoàn lại số lượng cho món bị xóa
        for (TempDrinkItem oldItem : session.getDrinks()) {
            boolean isStillInList = dto.getDrinks().stream()
                    .anyMatch(d -> d.getDrinkId().equals(oldItem.getDrink().getId()));
            if (!isStillInList) {
                DrinkFood drinkFood = oldItem.getDrink();
                drinkFood.setQuantity(drinkFood.getQuantity() + oldItem.getQuantity());
                drinkFoodRepository.save(drinkFood);
            }
        }

        session.getDrinks().clear();
        session.getDrinks().addAll(drinks);

        return tempTableSessionRepository.save(session);
    }

    public Optional<TempTableSession> getById(Long id) {
        return tempTableSessionRepository.findById(id);
    }
}
