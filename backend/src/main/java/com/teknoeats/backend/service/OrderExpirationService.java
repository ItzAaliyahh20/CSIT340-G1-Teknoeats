package com.teknoeats.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.teknoeats.backend.model.Order;
import com.teknoeats.backend.repository.OrderRepository;

@Service
public class OrderExpirationService {

    @Autowired
    private OrderRepository orderRepository;

    // Run every minute to check for expired orders
    @Scheduled(fixedRate = 60000) // 60 seconds = 60000 milliseconds
    @Transactional
    public void expireOverdueOrders() {
        LocalDateTime now = LocalDateTime.now();

        // Find orders that are ready for pickup and have passed their deadline
        List<Order> expiredOrders = orderRepository.findByStatusAndPickupDeadlineBefore(
            Order.OrderStatus.ready, now);

        for (Order order : expiredOrders) {
            order.setStatus(Order.OrderStatus.expired);
            orderRepository.save(order);
            System.out.println("Order " + order.getId() + " has been automatically expired due to pickup deadline.");
        }

        if (!expiredOrders.isEmpty()) {
            System.out.println("Expired " + expiredOrders.size() + " orders that passed their pickup deadline.");
        }
    }
}