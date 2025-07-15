package com.example.bidashop.controller;

import com.example.bidashop.jwt.JwtRequest;
import com.example.bidashop.jwt.JwtResponse;
import com.example.bidashop.model.User;
import com.example.bidashop.repository.UserRepository;
import com.example.bidashop.security.JwtUtil;
import com.example.bidashop.service.UserService;
import com.example.bidashop.utils.ApiResponse;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;
    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody JwtRequest jwtRequest) {
        try {
            // Xác thực thông tin đăng nhập
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(jwtRequest.getUsername(), jwtRequest.getPassword()));

            // Lấy thông tin người dùng
            final UserDetails userDetails = userDetailsService.loadUserByUsername(jwtRequest.getUsername());

            // Nếu thông tin người dùng không tồn tại
            if (userDetails == null) {
                return ResponseEntity.status(401).body(new ApiResponse<>(401, null, "Sai tên đăng nhập hoặc mật khẩu"));
            }

            // Tạo JWT token
            final String token = jwtUtil.generateToken(userDetails);

            // Trả về JWT token và thông tin người dùng
            User user = userRepository.findByUsername(jwtRequest.getUsername()).orElse(null);
            JwtResponse jwtResponse = new JwtResponse(token);
            return ResponseEntity
                    .ok(new ApiResponse<>(200, new Object[] { jwtResponse, user }, "Đăng nhập thành công"));

        } catch (Exception e) {
            // Nếu thông tin đăng nhập không đúng
            return ResponseEntity.status(401)
                    .body(new ApiResponse<>(401, null, "Sai thông tin đăng nhập hoặc mật khẩu"));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        // Kiểm tra nếu tên người dùng đã tồn tại với role = CUSTOMER và isDelete =
        // false
        if (userRepository.existsByUsernameAndRoleAndIsDeleteFalse(user.getUsername(), User.Role.CUSTOMER)) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(400, null, "Tên người dùng đã tồn tại"));
        }

        // Kiểm tra nếu email đã tồn tại với role = CUSTOMER và isDelete = false
        if (userRepository.existsByEmailAndRoleAndIsDeleteFalse(user.getEmail(), User.Role.CUSTOMER)) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(400, null, "Email đã được sử dụng"));
        }

        // Mã hóa mật khẩu và lưu người dùng mới
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);

        // Lấy đối tượng UserDetails sau khi lưu user
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());

        // Tạo JWT từ UserDetails
        String token = jwtUtil.generateToken(userDetails);

        // Trả về JWT token và thông tin người dùng sau khi đăng ký
        JwtResponse jwtResponse = new JwtResponse(token);
        return ResponseEntity.ok(new ApiResponse<>(200, new Object[] { jwtResponse, user }, "Đăng ký thành công"));
    }

    // API quên mật khẩu
    @PostMapping("/forgot-password")
    public String forgotPassword(@RequestBody Map<String, String> requestBody) {
        String email = requestBody.get("email"); // Lấy email từ body
        return userService.sendResetPasswordToken(email);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> requestBody) {
        // Lấy token và newPassword từ request body
        String token = requestBody.get("token");
        String newPassword = requestBody.get("newPassword");

        // Mã hóa mật khẩu mới trước khi gọi service
        String encodedPassword = passwordEncoder.encode(newPassword);

        // Gọi phương thức resetPassword trong userService với mật khẩu đã mã hóa
        String result = userService.resetPassword(token, encodedPassword);

        if (result.equals("Mật khẩu của bạn đã được cập nhật thành công")) {
            return ResponseEntity.ok(new ApiResponse<>(200, null, result));
        } else {
            return ResponseEntity.status(400).body(new ApiResponse<>(400, null, result));
        }
    }

}
