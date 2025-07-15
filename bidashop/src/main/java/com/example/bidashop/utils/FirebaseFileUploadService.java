package com.example.bidashop.utils;

import com.google.firebase.cloud.StorageClient;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service  // Đảm bảo rằng @Service đã được thêm vào
public class FirebaseFileUploadService {

    public String uploadFile(MultipartFile file, String folder) throws IOException {
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        
        // Upload the file to Firebase storage
        StorageClient.getInstance().bucket().create(folder + "/" + fileName, file.getBytes(), file.getContentType());
    
        // Return the file URL after uploading
        return String.format("https://firebasestorage.googleapis.com/v0/b/shopcompus.appspot.com/o/%s?alt=media", folder + "/" + fileName);
    }
    
}
