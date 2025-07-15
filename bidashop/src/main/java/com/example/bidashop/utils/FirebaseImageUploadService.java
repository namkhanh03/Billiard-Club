package com.example.bidashop.utils;

import com.google.firebase.cloud.StorageClient;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service  // Đảm bảo rằng @Service đã được thêm vào
public class FirebaseImageUploadService {

    public String uploadImage(MultipartFile file) throws IOException {
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();

        // Tải tệp lên Firebase Storage
        StorageClient.getInstance().bucket().create(fileName, file.getBytes(), file.getContentType());

        // Trả về URL của tệp đã tải lên
        return String.format("https://firebasestorage.googleapis.com/v0/b/shopcompus.appspot.com/o/%s?alt=media", fileName);
    }
}
