package com.teknoeats.backend.controller;

import com.teknoeats.backend.dto.DashboardStatsDTO;
import com.teknoeats.backend.dto.SignupRequest;
import com.teknoeats.backend.dto.UserDTO;
import com.teknoeats.backend.dto.OrderDTO;
import com.teknoeats.backend.model.Order;
import com.teknoeats.backend.model.Product;
import com.teknoeats.backend.service.AdminService;
import com.teknoeats.backend.service.FileUploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private FileUploadService fileUploadService;

    // ========== USER MANAGEMENT ==========

    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PostMapping("/users")
    public ResponseEntity<?> createUser(@RequestBody SignupRequest request) {
        try {
            UserDTO user = adminService.createUser(request);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UserDTO userDTO) {
        try {
            UserDTO user = adminService.updateUser(id, userDTO);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error: " + e.getMessage());
        }
    }

    // FIX: Updated deleteUser to handle both email string and numeric ID
    @DeleteMapping("/users/{identifier}")
    public ResponseEntity<?> deleteUser(@PathVariable String identifier) {
        try {
            // Try to parse as Long first (numeric ID)
            try {
                Long id = Long.parseLong(identifier);
                adminService.deleteUser(id);
                return ResponseEntity.ok("User deleted successfully");
            } catch (NumberFormatException e) {
                // If it's not a number, treat it as email
                // Find user by email and delete
                List<UserDTO> users = adminService.getAllUsers();
                UserDTO userToDelete = users.stream()
                    .filter(u -> u.getEmail().equals(identifier))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("User not found with email: " + identifier));
                
                adminService.deleteUser(userToDelete.getId());
                return ResponseEntity.ok("User deleted successfully");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error: " + e.getMessage());
        }
    }

    // ========== PRODUCT MANAGEMENT ==========

    @PostMapping("/menu/products")
    public ResponseEntity<?> addProduct(
            @RequestParam("name") String name,
            @RequestParam("price") Double price,
            @RequestParam("category") String category,
            @RequestParam(value = "stock", defaultValue = "0") Integer stock,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        try {
            Product product = new Product();
            product.setName(name);
            product.setPrice(BigDecimal.valueOf(price));
            product.setCategory(category);
            product.setStock(stock);

            if (image != null && !image.isEmpty()) {
                String imagePath = fileUploadService.saveFile(image);
                product.setImage(imagePath);
            } else {
                product.setImage("/placeholder.svg");
            }

            Product savedProduct = adminService.addProduct(product);
            return ResponseEntity.ok(savedProduct);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/menu/products/{id}")
    public ResponseEntity<?> updateProduct(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam("price") Double price,
            @RequestParam("category") String category,
            @RequestParam(value = "stock", defaultValue = "0") Integer stock,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "existingImage", required = false) String existingImage) {
        try {
            Product product = adminService.getProductById(id);

            product.setName(name);
            product.setPrice(BigDecimal.valueOf(price));
            product.setCategory(category);
            product.setStock(stock);

            if (image != null && !image.isEmpty()) {
                if (product.getImage() != null && !product.getImage().equals("/placeholder.svg")) {
                    fileUploadService.deleteFile(product.getImage());
                }
                String imagePath = fileUploadService.saveFile(image);
                product.setImage(imagePath);
            } else if (existingImage != null) {
                product.setImage(existingImage);
            }

            Product updatedProduct = adminService.updateProduct(id, product);
            return ResponseEntity.ok(updatedProduct);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error: " + e.getMessage());
        }
    }

    @DeleteMapping("/menu/products/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        try {
            Product product = adminService.getProductById(id);

            if (product.getImage() != null && !product.getImage().equals("/placeholder.svg")) {
                fileUploadService.deleteFile(product.getImage());
            }

            adminService.deleteProduct(id);
            return ResponseEntity.ok("Product deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/menu/products")
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(adminService.getAllProducts());
    }

    @GetMapping("/menu/products/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Long id) {
        try {
            Product product = adminService.getProductById(id);
            return ResponseEntity.ok(product);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: " + e.getMessage());
        }
    }

    // ========== ORDER MANAGEMENT ==========

    @GetMapping("/orders")
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        List<Order> orders = adminService.getAllOrders();
        List<OrderDTO> orderDTOs = orders.stream()
            .map(adminService::convertOrderToDTO)
            .collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(orderDTOs);
    }

    @GetMapping("/orders/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable Long id) {
        try {
            Order order = adminService.getOrderById(id);
            OrderDTO orderDTO = adminService.convertOrderToDTO(order);
            return ResponseEntity.ok(orderDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            Order order = adminService.updateOrderStatus(id, status);
            OrderDTO orderDTO = adminService.convertOrderToDTO(order);
            return ResponseEntity.ok(orderDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error: " + e.getMessage());
        }
    }

    // ========== DASHBOARD STATISTICS ==========

    @GetMapping("/dashboard/stats")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }
}