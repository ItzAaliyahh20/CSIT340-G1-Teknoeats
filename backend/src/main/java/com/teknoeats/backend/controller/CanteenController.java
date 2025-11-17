package com.teknoeats.backend.controller;

import com.teknoeats.backend.dto.DashboardStatsDTO;
import com.teknoeats.backend.model.Order;
import com.teknoeats.backend.service.CanteenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/canteen")
@CrossOrigin(origins = "http://localhost:3000")
public class CanteenController {

    @Autowired
    private CanteenService canteenService;

    @GetMapping("/orders/active")
    public ResponseEntity<List<Order>> getActiveOrders() {
        return ResponseEntity.ok(canteenService.getActiveOrders());
    }

    @GetMapping("/orders/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable Long id) {
        try {
            Order order = canteenService.getOrderById(id);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            Order order = canteenService.updateOrderStatus(id, status);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<DashboardStatsDTO> getCanteenStats() {
        return ResponseEntity.ok(canteenService.getCanteenStats());
    }
}
