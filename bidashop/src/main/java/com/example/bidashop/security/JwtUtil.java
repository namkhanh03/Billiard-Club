package com.example.bidashop.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.example.bidashop.model.User;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtUtil {

    // Thay đổi secretKey thành một SecretKey mạnh hơn
    private final SecretKey secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey) // Sử dụng SecretKey mạnh để giải mã
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // Tạo JWT từ UserDetails
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();

        // Thêm thông tin người dùng vào claims
        if (userDetails instanceof User) {
            User user = (User) userDetails;
            claims.put("username", user.getUsername());
            claims.put("email", user.getEmail()); // Thêm email
            claims.put("role", user.getRole()); // Thêm role
            // Thêm các thông tin khác nếu cần
            claims.put("address", user.getAddress());
            claims.put("fullName", user.getFullName());
            claims.put("avatar", user.getAvatar());
            claims.put("phoneNumber", user.getPhoneNumber());
        }

        return createToken(claims, userDetails.getUsername());
    }

    // Tạo JWT với thông tin người dùng
    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // Token hết hạn sau 10 giờ
                .signWith(secretKey) // Ký JWT với SecretKey mạnh
                .compact();
    }

    // Xác thực token
    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
}
