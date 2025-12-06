package com.teknoeats.backend.service;

import com.teknoeats.backend.dto.OrderDTO;
import com.teknoeats.backend.dto.OrderItemDTO;
import com.teknoeats.backend.model.Order;
import com.teknoeats.backend.model.OrderItem;
import com.teknoeats.backend.model.Product;
import com.teknoeats.backend.model.User;
import com.teknoeats.backend.repository.OrderRepository;
import com.teknoeats.backend.repository.ProductRepository;
import com.teknoeats.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

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
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Create order
        Order order = new Order();
        order.setUser(user);
        order.setStatus(Order.OrderStatus.pending);
        order.setTotal(orderDTO.getTotal());
        order.setPaymentMethod(orderDTO.getPaymentMethod());
        order.setPickupTime(orderDTO.getPickupTime());

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

        return orderRepository.save(order);
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

        // Format date - handle both createdAt formats
        if (order.getCreatedAt() != null) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy hh:mm a");
            dto.setDate(order.getCreatedAt().format(formatter));
        }

        // Convert items with complete product information
        List<OrderItemDTO> itemDTOs = order.getItems().stream()
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