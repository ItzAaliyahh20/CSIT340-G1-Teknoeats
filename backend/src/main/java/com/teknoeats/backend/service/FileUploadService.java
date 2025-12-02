package com.teknoeats.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileUploadService {
    
    @Value("${file.upload-dir:uploads/images}")
    private String uploadDir;
    
    public String saveFile(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IOException("Failed to store empty file");
        }
        
        // Create uploads directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String fileExtension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String uniqueFilename = UUID.randomUUID().toString() + fileExtension;
        
        // Save file
        Path destinationFile = uploadPath.resolve(uniqueFilename);
        Files.copy(file.getInputStream(), destinationFile, StandardCopyOption.REPLACE_EXISTING);
        
        // Return the URL path
        return "/uploads/images/" + uniqueFilename;
    }
    
    public void deleteFile(String filePath) {
        try {
            if (filePath != null && filePath.startsWith("/uploads/images/")) {
                String filename = filePath.substring("/uploads/images/".length());
                Path file = Paths.get(uploadDir).resolve(filename);
                Files.deleteIfExists(file);
            }
        } catch (IOException e) {
            // Log error but don't fail the operation
            System.err.println("Failed to delete file: " + filePath);
        }
    }
}