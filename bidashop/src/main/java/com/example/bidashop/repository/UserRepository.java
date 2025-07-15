package com.example.bidashop.repository;

import com.example.bidashop.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

        Optional<User> findByUsername(String username);

        Optional<User> findByEmail(String email);

        Optional<User> findByPhoneNumber(String phoneNumber);

        boolean existsByUsername(String username);

        boolean existsByEmail(String email);

        Optional<User> findByResetPasswordToken(String token);

        boolean existsByPhoneNumber(String phoneNumber);

        // Thêm phương thức tìm kiếm người dùng không bị xóa
        Page<User> findByIsDeleteFalse(Pageable pageable);

        Page<User> findByIsDeleteFalseAndRole(User.Role role, Pageable pageable);

        @Query("SELECT u FROM User u WHERE u.isDelete = false AND " +
                        "(u.fullName LIKE %:keyword% OR u.email LIKE %:keyword% OR u.phoneNumber LIKE %:keyword%)")
        Page<User> findByIsDeleteFalseAndKeyword(@Param("keyword") String keyword, Pageable pageable);

        @Query("SELECT u FROM User u WHERE u.isDelete = false AND u.role = :role AND " +
                        "(u.fullName LIKE %:keyword% OR u.email LIKE %:keyword% OR u.phoneNumber LIKE %:keyword%)")
        Page<User> findByIsDeleteFalseAndRoleAndKeyword(@Param("role") User.Role role, @Param("keyword") String keyword,
                        Pageable pageable);

        @Query("SELECT COUNT(u) FROM User u WHERE u.isDelete = false")
        Long countActiveUsers();

        List<User> findByRoleIn(List<String> list);

        @Query("SELECT u FROM User u WHERE u.isDelete = false AND u.role <> :role")
        Page<User> findByIsDeleteFalseAndRoleNot(@Param("role") User.Role role, Pageable pageable);

        boolean existsByUsernameAndRoleAndIsDeleteFalse(String username, User.Role role);

        boolean existsByEmailAndRoleAndIsDeleteFalse(String email, User.Role role);

        boolean existsByPhoneNumberAndRoleAndIsDeleteFalse(String phoneNumber, User.Role role);

        boolean existsByUsernameAndIsDeleteFalse(String username);

        boolean existsByEmailAndIsDeleteFalse(String email);

        boolean existsByPhoneNumberAndIsDeleteFalse(String phoneNumber);
        Long countByRoleAndIsDeleteFalse(User.Role role);

}
