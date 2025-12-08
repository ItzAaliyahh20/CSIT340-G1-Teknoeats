package com.teknoeats.backend.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.teknoeats.backend.dto.OrderDTO;
import com.teknoeats.backend.dto.OrderItemDTO;
import com.teknoeats.backend.model.Order;
import com.teknoeats.backend.model.OrderItem;
import com.teknoeats.backend.model.Product;
import com.teknoeats.backend.model.User;
import com.teknoeats.backend.repository.OrderRepository;
import com.teknoeats.backend.repository.ProductRepository;
import com.teknoeats.backend.repository.UserRepository;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Order createOrder(Long userId, OrderDTO orderDTO) {
        System.out.println("DEBUG: Creating order for userId: " + userId);
        System.out.println("DEBUG: OrderDTO - total: " + orderDTO.getTotal() + ", paymentMethod: " + orderDTO.getPaymentMethod() + ", pickupTime: " + orderDTO.getPickupTime() + ", notes: " + orderDTO.getNotes());

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Create order
        Order order = new Order();
        order.setUser(user);
        order.setStatus(Order.OrderStatus.pending);
        order.setTotal(orderDTO.getTotal());
        order.setPaymentMethod(orderDTO.getPaymentMethod());
        order.setPickupTime(orderDTO.getPickupTime());
        // Set pickup deadline to 15 minutes from now
        order.setPickupDeadline(LocalDateTime.now().plusMinutes(15));
        order.setNotes(orderDTO.getNotes());

        System.out.println("DEBUG: Order object created, about to save");

        // Add order items
        for (OrderItemDTO itemDTO : orderDTO.getItems()) {
            Product product = productRepository.findById(itemDTO.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + itemDTO.getProductId()));

            // Check stock
            if (product.getStock() < itemDTO.getQuantity()) {
                throw new RuntimeException("Insufficient stock for " + product.getName());
            }

            // Reduce stock
            product.setStock(product.getStock() - itemDTO.getQuantity());
            productRepository.save(product);

            // Create order item
            OrderItem orderItem = new OrderItem(product, itemDTO.getQuantity(), product.getPrice());
            order.addItem(orderItem);
        }

        Order savedOrder = orderRepository.save(order);
        System.out.println("DEBUG: Order saved successfully with ID: " + savedOrder.getId());
        return savedOrder;
    }

    public List<OrderDTO> getUserOrders(Long userId) {
        List<Order> orders = orderRepository.findByUserId(userId);
        return orders.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public OrderDTO getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return convertToDTO(order);
    }

    // Convert Order entity to DTO with complete information
    public OrderDTO convertToDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setUserId(order.getUser().getId());
        dto.setStatus(order.getStatus().name());
        dto.setTotal(order.getTotal());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setPickupTime(order.getPickupTime());
        // Convert pickup deadline to string for frontend
        if (order.getPickupDeadline() != null) {
            dto.setPickupDeadline(order.getPickupDeadline().toString());
        }
        dto.setNotes(order.getNotes());

        // Format date - handle both createdAt formats
        if (order.getCreatedAt() != null) {
            try {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy hh:mm a");
                dto.setDate(order.getCreatedAt().format(formatter));
            } catch (Exception e) {
                // Fallback if formatting fails
                dto.setDate(order.getCreatedAt().toString());
            }
        } else {
            // Fallback for null createdAt
            dto.setDate("Unknown date");
        }

        // Convert items with complete product information
        List<OrderItemDTO> itemDTOs = order.getItems().stream()
                .filter(item -> item.getProduct() != null) // Filter out items with null products
                .map(item -> {
                    OrderItemDTO itemDTO = new OrderItemDTO();
                    itemDTO.setProductId(item.getProduct().getId());
                    itemDTO.setName(item.getProduct().getName());
                    itemDTO.setQuantity(item.getQuantity());
                    itemDTO.setPrice(item.getPrice());
                    itemDTO.setCategory(item.getProduct().getCategory());
                    itemDTO.setImage(item.getProduct().getImage());
                    return itemDTO;
                })
                .collect(Collectors.toList());

        dto.setItems(itemDTOs);
        return dto;
    }

}