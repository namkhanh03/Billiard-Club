package com.example.bidashop.service;

import com.example.bidashop.model.Facility;
import com.example.bidashop.model.FacilityUser;
import com.example.bidashop.model.User;
import com.example.bidashop.repository.FacilityRepository;
import com.example.bidashop.repository.FacilityUserRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FacilityUserService {

    @Autowired
    private FacilityUserRepository facilityUserRepository;

    @Autowired
    private FacilityRepository facilityRepository;

    /**
     * Lấy danh sách chi nhánh mà user quản lý
     */
    public List<Facility> getFacilitiesByUser(User user) {
        // Nếu user là ADMIN thì lấy tất cả chi nhánh chưa bị xóa
        if ("ADMIN".equals(user.getRole().name())) {
            return facilityRepository.findByIsDeleteFalse();
        }

        // Ngược lại, chỉ lấy các chi nhánh mà user đang được phân quyền
        List<FacilityUser> facilityUsers = facilityUserRepository.findByUser(user);
        return facilityUsers.stream()
                .map(FacilityUser::getFacility)
                .filter(f -> !Boolean.TRUE.equals(f.getIsDelete())) // chỉ lấy facility chưa bị xóa
                .collect(Collectors.toList());
    }

    /**
     * Cập nhật danh sách chi nhánh mà user quản lý
     */
    @Transactional
    public List<Facility> updateUserFacilities(User user, List<Long> facilityIds) {
        // Xóa danh sách cũ
        facilityUserRepository.deleteByUser(user);

        // Lấy danh sách facility từ ID
        List<Facility> facilities = facilityRepository.findAllById(facilityIds);

        // Gán mới danh sách chi nhánh cho user
        List<FacilityUser> newFacilityUsers = facilities.stream()
                .map(facility -> new FacilityUser(user, facility))
                .collect(Collectors.toList());

        // Lưu các mối quan hệ mới
        facilityUserRepository.saveAll(newFacilityUsers);

        return facilities;
    }
}
