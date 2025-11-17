package com.teknoeats.backend.repository;

import com.teknoeats.backend.model.Order;
import com.teknoeats.backend.model.Order.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // Find all orders by user ID
    List<Order> findByUserId(Long userId);

    // Find all orders by status
    List<Order> findByStatus(OrderStatus status);

    // Find all orders with status in a list (for active orders: pending, preparing, ready)
    List<Order> findByStatusIn(List<OrderStatus> statuses);

    // Find orders created after a specific date/time (for today's orders)
    @Query("SELECT o FROM Order o WHERE o.createdAt >= :dateTime")
    List<Order> findOrdersCreatedAfter(@Param("dateTime") LocalDateTime dateTime);

    // Find all orders ordered by creation date (newest first)
    @Query("SELECT o FROM Order o ORDER BY o.createdAt DESC")
    List<Order> findAllOrderByCreatedAtDesc();

    // Find orders by user ID and status
    List<Order> findByUserIdAndStatus(Long userId, OrderStatus status);

    // Count orders by status
    Long countByStatus(OrderStatus status);
}