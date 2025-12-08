package com.teknoeats.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.teknoeats.backend.dto.DashboardStatsDTO;
import com.teknoeats.backend.dto.OrderDTO;
import com.teknoeats.backend.model.Order;
import com.teknoeats.backend.service.CanteenService;

@RestController
@RequestMapping("/api/canteen")
@CrossOrigin(origins = "http://localhost:3000")
public class CanteenController {

    @Autowired
    private CanteenService canteenService;

    @GetMapping("/orders/active")
    public ResponseEntity<List<OrderDTO>> getActiveOrders() {
        return ResponseEntity.ok(canteenService.getActiveOrders());
    }

    @GetMapping("/orders")
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        return ResponseEntity.ok(canteenService.getAllOrders());
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
        System.out.println("CANTEEN CONTROLLER: Received request to update order " + id + " to status: " + status);
        try {
            OrderDTO order = canteenService.updateOrderStatus(id, status);
            System.out.println("CANTEEN CONTROLLER: Successfully updated order " + id + " to status: " + order.getStatus());
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            System.err.println("CANTEEN CONTROLLER: Error updating order status: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<DashboardStatsDTO> getCanteenStats() {
        return ResponseEntity.ok(canteenService.getCanteenStats());
    }
}
