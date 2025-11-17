package com.teknoeats.backend.service;

import com.teknoeats.backend.dto.DashboardStatsDTO;
import com.teknoeats.backend.model.Order;
import com.teknoeats.backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

@Service
public class CanteenService {

    @Autowired
    private OrderRepository orderRepository;

    public List<Order> getActiveOrders() {
        return orderRepository.findByStatusIn(Arrays.asList(
                Order.OrderStatus.pending,
                Order.OrderStatus.preparing,
                Order.OrderStatus.ready
        ));
    }

    public Order updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(Order.OrderStatus.valueOf(status));
        return orderRepository.save(order);
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public DashboardStatsDTO getCanteenStats() {
        List<Order> allOrders = orderRepository.findAll();

        // Today's orders
        LocalDateTime startOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MIN);
        List<Order> todayOrders = orderRepository.findOrdersCreatedAfter(startOfDay);

        long pendingCount = allOrders.stream()
                .filter(o -> o.getStatus() == Order.OrderStatus.pending)
                .count();

        long preparingCount = allOrders.stream()
                .filter(o -> o.getStatus() == Order.OrderStatus.preparing)
                .count();

        long readyCount = allOrders.stream()
                .filter(o -> o.getStatus() == Order.OrderStatus.ready)
                .count();

        long completedToday = todayOrders.stream()
                .filter(o -> o.getStatus() == Order.OrderStatus.delivered)
                .count();

        BigDecimal revenueToday = todayOrders.stream()
                .filter(o -> o.getStatus() == Order.OrderStatus.delivered)
                .map(Order::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        DashboardStatsDTO stats = new DashboardStatsDTO();
        stats.setPendingOrders((int) pendingCount);
        stats.setPreparingOrders((int) preparingCount);
        stats.setReadyOrders((int) readyCount);
        stats.setCompletedToday((int) completedToday);
        stats.setRevenueToday(revenueToday);

        return stats;
    }
}