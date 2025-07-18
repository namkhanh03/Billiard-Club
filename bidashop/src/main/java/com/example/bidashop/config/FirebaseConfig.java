package com.example.bidashop.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.FileInputStream;
import java.io.IOException;

@Configuration
public class FirebaseConfig {

    @Bean
    public FirebaseApp initializeFirebase() throws IOException {
        // Kiểm tra xem FirebaseApp đã được khởi tạo chưa
        if (FirebaseApp.getApps().isEmpty()) {
            FileInputStream serviceAccount = new FileInputStream("src/main/resources/serviceAccountKey.json");

            FirebaseOptions options = new FirebaseOptions.Builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .setStorageBucket("shopcompus.appspot.com") // Thay bằng project ID của bạn
                    .build();

            // Chỉ khởi tạo nếu chưa có FirebaseApp
            return FirebaseApp.initializeApp(options);
        } else {
            // Trả về FirebaseApp mặc định nếu đã khởi tạo
            return FirebaseApp.getInstance();
        }
    }
}
