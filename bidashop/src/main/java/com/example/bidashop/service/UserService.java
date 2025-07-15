package com.example.bidashop.service;

import com.example.bidashop.model.User;
import com.example.bidashop.repository.UserRepository;
import com.example.bidashop.utils.FirebaseImageUploadService;
import com.example.bidashop.utils.PaginationResponse;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FirebaseImageUploadService firebaseImageUploadService;
    @Autowired
    private JavaMailSender mailSender;

    public PaginationResponse<User> getAllUsers(String keyword, String role, int page, int limit) {
        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by("fullName").ascending());
        Page<User> userPage;

        // Chuyển đổi role từ String sang Enum nếu có
        User.Role roleEnum = null;
        if (role != null && !role.isEmpty()) {
            try {
                roleEnum = User.Role.valueOf(role); // Chuyển đổi String thành Enum
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Vai trò không hợp lệ: " + role);
            }
        }

        // Nếu có từ khóa và role
        if (keyword != null && !keyword.isEmpty() && roleEnum != null) {
            userPage = userRepository.findByIsDeleteFalseAndRoleAndKeyword(roleEnum, keyword, pageable);
        }
        // Nếu chỉ có role
        else if (roleEnum != null) {
            userPage = userRepository.findByIsDeleteFalseAndRole(roleEnum, pageable);
        }
        // Nếu chỉ có từ khóa
        else if (keyword != null && !keyword.isEmpty()) {
            userPage = userRepository.findByIsDeleteFalseAndKeyword(keyword, pageable);
        }
        // Nếu không có từ khóa và role
        else {
            userPage = userRepository.findByIsDeleteFalse(pageable);
        }

        PaginationResponse<User> response = new PaginationResponse<>();
        response.setContent(userPage.getContent());
        response.setPage(page);
        response.setLimit(limit);
        response.setTotalElements(userPage.getTotalElements());
        response.setTotalPages(userPage.getTotalPages());

        return response;
    }

    public PaginationResponse<User> getAllStaff(String keyword, String role, int page, int limit) {
        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by("fullName").ascending());
        Page<User> userPage;

        // Chuyển đổi role từ String sang Enum nếu có
        User.Role roleEnum = null;
        if (role != null && !role.isEmpty()) {
            try {
                roleEnum = User.Role.valueOf(role); // Chuyển đổi String thành Enum
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Vai trò không hợp lệ: " + role);
            }
        }

        // Nếu có từ khóa và role khác "CUSTOMER"
        if (keyword != null && !keyword.isEmpty() && roleEnum != null && !roleEnum.equals(User.Role.CUSTOMER)) {
            userPage = userRepository.findByIsDeleteFalseAndRoleAndKeyword(roleEnum, keyword, pageable);
        }
        // Nếu chỉ có role khác "CUSTOMER"
        else if (roleEnum != null && !roleEnum.equals(User.Role.CUSTOMER)) {
            userPage = userRepository.findByIsDeleteFalseAndRole(roleEnum, pageable);
        }
        // Nếu chỉ có từ khóa
        else if (keyword != null && !keyword.isEmpty()) {
            userPage = userRepository.findByIsDeleteFalseAndKeyword(keyword, pageable);
        }
        // Nếu không có từ khóa và role, thì chỉ lấy users không phải "CUSTOMER"
        else {
            userPage = userRepository.findByIsDeleteFalseAndRoleNot(User.Role.CUSTOMER, pageable);
        }

        PaginationResponse<User> response = new PaginationResponse<>();
        response.setContent(userPage.getContent());
        response.setPage(page);
        response.setLimit(limit);
        response.setTotalElements(userPage.getTotalElements());
        response.setTotalPages(userPage.getTotalPages());

        return response;
    }

    // Lấy người dùng theo ID
    public Optional<User> getUserById(Long userId) {
        return userRepository.findById(userId);
    }

    // Tạo người dùng mới
    public String createUser(User user, MultipartFile imageFile) throws IOException {
        // Kiểm tra tính duy nhất của username, email và phoneNumber
        if (user.getRole() == User.Role.CUSTOMER) {
            if (userRepository.existsByUsernameAndRoleAndIsDeleteFalse(user.getUsername(), User.Role.CUSTOMER)) {
                return "Username đã tồn tại";
            }
            if (userRepository.existsByEmailAndRoleAndIsDeleteFalse(user.getEmail(), User.Role.CUSTOMER)) {
                return "Email đã tồn tại";
            }
            if (userRepository.existsByPhoneNumberAndRoleAndIsDeleteFalse(user.getPhoneNumber(), User.Role.CUSTOMER)) {
                return "Số điện thoại đã tồn tại";
            }
        } else {
            if (userRepository.existsByUsernameAndIsDeleteFalse(user.getUsername())) {
                return "Username đã tồn tại";
            }
            if (userRepository.existsByEmailAndIsDeleteFalse(user.getEmail())) {
                return "Email đã tồn tại";
            }
            if (userRepository.existsByPhoneNumberAndIsDeleteFalse(user.getPhoneNumber())) {
                return "Số điện thoại đã tồn tại";
            }
        }

        // Xử lý upload avatar nếu có
        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = firebaseImageUploadService.uploadImage(imageFile); // Tải avatar lên Firebase
            user.setAvatar(imageUrl); // Lưu URL ảnh vào User
        }

        userRepository.save(user); // Lưu User vào cơ sở dữ liệu
        return "Tạo người dùng thành công"; // Trả về thông điệp thành công
    }

    public String updateUser(Long id, User userDetails, MultipartFile imageFile) throws IOException {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Người dùng không tồn tại"));

        // Kiểm tra tính duy nhất của username, email và phoneNumber
        if (userDetails.getRole() == User.Role.CUSTOMER) {
            if (!user.getUsername().equals(userDetails.getUsername())
                    && userRepository.existsByUsernameAndRoleAndIsDeleteFalse(userDetails.getUsername(),
                            User.Role.CUSTOMER)) {
                return "Username đã tồn tại";
            }
            if (!user.getEmail().equals(userDetails.getEmail())
                    && userRepository.existsByEmailAndRoleAndIsDeleteFalse(userDetails.getEmail(),
                            User.Role.CUSTOMER)) {
                return "Email đã tồn tại";
            }
            if (!user.getPhoneNumber().equals(userDetails.getPhoneNumber())
                    && userRepository.existsByPhoneNumberAndRoleAndIsDeleteFalse(userDetails.getPhoneNumber(),
                            User.Role.CUSTOMER)) {
                return "Số điện thoại đã tồn tại";
            }
        } else {
            if (!user.getUsername().equals(userDetails.getUsername())
                    && userRepository.existsByUsernameAndIsDeleteFalse(userDetails.getUsername())) {
                return "Username đã tồn tại";
            }
            if (!user.getEmail().equals(userDetails.getEmail())
                    && userRepository.existsByEmailAndIsDeleteFalse(userDetails.getEmail())) {
                return "Email đã tồn tại";
            }
            if (!user.getPhoneNumber().equals(userDetails.getPhoneNumber())
                    && userRepository.existsByPhoneNumberAndIsDeleteFalse(userDetails.getPhoneNumber())) {
                return "Số điện thoại đã tồn tại";
            }
        }

        user.setUsername(userDetails.getUsername());
        user.setEmail(userDetails.getEmail());
        user.setPhoneNumber(userDetails.getPhoneNumber());
        user.setFullName(userDetails.getFullName());
        user.setAddress(userDetails.getAddress());
        user.setRole(userDetails.getRole());

        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = firebaseImageUploadService.uploadImage(imageFile); // Upload avatar mới
            user.setAvatar(imageUrl);
        }

        userRepository.save(user); // Lưu người dùng đã cập nhật
        return "Cập nhật người dùng thành công"; // Trả về thông điệp thành công
    }

    // Xóa người dùng bằng cách cập nhật isDelete thành true (soft delete)
    public boolean deleteUser(Long userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            User existingUser = user.get();
            existingUser.setIsDelete(true); // Soft delete bằng cách đặt cờ isDelete thành true
            userRepository.save(existingUser); // Lưu người dùng đã xóa
            return true; // Trả về thông điệp thành công
        }
        return false; // Trả về thông điệp lỗi
    }

    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<User> getUserByPhoneNumber(String phoneNumber) {
        return userRepository.findByPhoneNumber(phoneNumber);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public void saveUser(User user) {
        userRepository.save(user); // Sử dụng repository để lưu người dùng vào cơ sở dữ liệu
    }

    public String sendResetPasswordToken(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (!userOptional.isPresent()) {
            return "Email không tồn tại trong hệ thống";
        }

        User user = userOptional.get();
        String token = UUID.randomUUID().toString(); // Tạo mã token ngẫu nhiên
        user.setResetPasswordToken(token);
        userRepository.save(user); // Lưu token vào cơ sở dữ liệu

        // Gửi email với mã token
        String resetPasswordLink = "http://localhost:3000/reset-password?token=" + token;
        sendEmail(user.getEmail(), resetPasswordLink);

        return "Liên kết đặt lại mật khẩu đã được gửi đến email của bạn";
    }

    private void sendEmail(String recipientEmail, String link) {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);

        try {
            helper.setTo(recipientEmail);
            helper.setSubject("Đặt lại mật khẩu");
            helper.setText("<p>Xin chào,</p>" +
                    "<p>Bạn đã yêu cầu đặt lại mật khẩu.</p>" +
                    "<p>Nhấn vào liên kết dưới đây để thay đổi mật khẩu:</p>" +
                    "<p><a href=\"" + link + "\">Đặt lại mật khẩu</a></p>", true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new IllegalStateException("Gửi email thất bại", e);
        }

    }

    public String resetPassword(String token, String encodedPassword) {
        Optional<User> userOptional = userRepository.findByResetPasswordToken(token);

        if (!userOptional.isPresent()) {
            return "Token không hợp lệ hoặc đã hết hạn";
        }

        User user = userOptional.get();
        user.setPassword(encodedPassword); // Mật khẩu đã được mã hóa
        user.setResetPasswordToken(null); // Xóa token sau khi mật khẩu được đặt lại
        userRepository.save(user); // Lưu người dùng với mật khẩu mới

        return "Mật khẩu của bạn đã được cập nhật thành công";
    }

}
