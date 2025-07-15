package com.example.bidashop.controller;

import com.example.bidashop.model.Facility;
import com.example.bidashop.model.User;
import com.example.bidashop.service.FacilityUserService;
import com.example.bidashop.service.UserService;
import com.example.bidashop.utils.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/facility-users")
public class FacilityUserController {

    @Autowired
    private FacilityUserService facilityUserService;

    @Autowired
    private UserService userService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<Facility>>> getFacilityByUser(@PathVariable Long userId) {
        Optional<User> user = userService.getUserById(userId);
        if (!user.isPresent()) {
            return ResponseEntity.status(404).body(new ApiResponse<>(404, null, "Không tìm thấy người dùng"));
        }

        List<Facility> facilities = facilityUserService.getFacilitiesByUser(user.get());
        return ResponseEntity.ok(new ApiResponse<>(200, facilities, "Lấy danh sách chi nhánh thành công"));
    }

    @PutMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<Facility>>> updateUserManageFacility(
            @PathVariable Long userId,
            @RequestBody List<Long> facilityIds) {
        Optional<User> user = userService.getUserById(userId);
        if (!user.isPresent()) {
            return ResponseEntity.status(404).body(new ApiResponse<>(404, null, "Không tìm thấy người dùng"));
        }

        List<Facility> updatedFacilities = facilityUserService.updateUserFacilities(user.get(), facilityIds);
        return ResponseEntity.ok(new ApiResponse<>(200, updatedFacilities, "Cập nhật danh sách chi nhánh thành công"));
    }
}
