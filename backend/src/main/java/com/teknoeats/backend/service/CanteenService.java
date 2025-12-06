package com.teknoeats.backend.service;

import com.teknoeats.backend.dto.DashboardStatsDTO;
import com.teknoeats.backend.dto.OrderDTO;
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
import java.util.stream.Collectors;

@Service
public class CanteenService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderService orderService;

    public List<OrderDTO> getActiveOrders() {
        List<Order> orders = orderRepository.findByStatusIn(Arrays.asList(
                Order.OrderStatus.pending,
                Order.OrderStatus.preparing,
                Order.OrderStatus.ready
        ));
        return orders.stream()
                .map(orderService::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<OrderDTO> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        System.out.println("CANTEEN ALL ORDERS DEBUG: Total orders in DB: " + orders.size());

        // Count by status
        long pending = orders.stream().filter(o -> o.getStatus() == Order.OrderStatus.pending).count();
        long preparing = orders.stream().filter(o -> o.getStatus() == Order.OrderStatus.preparing).count();
        long ready = orders.stream().filter(o -> o.getStatus() == Order.OrderStatus.ready).count();
        long delivered = orders.stream().filter(o -> o.getStatus() == Order.OrderStatus.delivered).count();

        System.out.println("CANTEEN ALL ORDERS DEBUG: Status counts - Pending: " + pending + ", Preparing: " + preparing + ", Ready: " + ready + ", Delivered: " + delivered);

        List<OrderDTO> orderDTOs = orders.stream()
                .map(orderService::convertToDTO)
                .collect(Collectors.toList());

        System.out.println("CANTEEN ALL ORDERS DEBUG: Returning " + orderDTOs.size() + " OrderDTOs");

        return orderDTOs;
    }

    public OrderDTO updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(Order.OrderStatus.valueOf(status));
        Order savedOrder = orderRepository.save(order);
        return orderService.convertToDTO(savedOrder);
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public DashboardStatsDTO getCanteenStats() {
        List<Order> allOrders = orderRepository.findAll();

        // Today's orders - use current date in system timezone
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.atTime(LocalTime.MAX);

        // Find orders created between start and end of today
        List<Order> todayOrders = allOrders.stream()
                .filter(order -> {
                    LocalDateTime createdAt = order.getCreatedAt();
                    return createdAt != null &&
                           !createdAt.isBefore(startOfDay) &&
                           !createdAt.isAfter(endOfDay);
                })
                .collect(Collectors.toList());

        System.out.println("CANTEEN STATS DEBUG: Total orders: " + allOrders.size());
        System.out.println("CANTEEN STATS DEBUG: Today's date: " + today);
        System.out.println("CANTEEN STATS DEBUG: Start of day: " + startOfDay);
        System.out.println("CANTEEN STATS DEBUG: End of day: " + endOfDay);
        System.out.println("CANTEEN STATS DEBUG: Today's orders (filtered): " + todayOrders.size());

        long pendingCount = allOrders.stream()
                .filter(o -> o.getStatus() == Order.OrderStatus.pending)
                .count();

        long preparingCount = allOrders.stream()
                .filter(o -> o.getStatus() == Order.OrderStatus.preparing)
                .count();

        long readyCount = allOrders.stream()
                .filter(o -> o.getStatus() == Order.OrderStatus.ready)
                .count();

        // Debug: List today's orders with their details
        System.out.println("CANTEEN STATS DEBUG: Today's orders details:");
        todayOrders.forEach(order -> {
            System.out.println("  Order ID: " + order.getId() +
                             ", Status: " + order.getStatus() +
                             ", Created: " + order.getCreatedAt() +
                             ", Total: " + order.getTotal());
        });

        long completedToday = todayOrders.stream()
                .filter(o -> o.getStatus() == Order.OrderStatus.delivered)
                .count();

        BigDecimal revenueToday = todayOrders.stream()
                .filter(o -> o.getStatus() == Order.OrderStatus.delivered)
                .map(Order::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        System.out.println("CANTEEN STATS DEBUG: Final calculations - Completed today: " + completedToday + ", Revenue: " + revenueToday);

        System.out.println("CANTEEN STATS DEBUG: Pending: " + pendingCount + ", Preparing: " + preparingCount + ", Ready: " + readyCount);
        System.out.println("CANTEEN STATS DEBUG: Completed today: " + completedToday + ", Revenue: " + revenueToday);

        DashboardStatsDTO stats = new DashboardStatsDTO();
        stats.setPendingOrders((int) pendingCount);
        stats.setPreparingOrders((int) preparingCount);
        stats.setReadyOrders((int) readyCount);
        stats.setCompletedToday((int) completedToday);
        stats.setRevenueToday(revenueToday);

        return stats;
    }
}