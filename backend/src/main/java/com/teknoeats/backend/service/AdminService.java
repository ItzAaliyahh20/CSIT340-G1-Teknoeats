package com.teknoeats.backend.service;

import com.teknoeats.backend.dto.DashboardStatsDTO;
import com.teknoeats.backend.dto.SignupRequest;
import com.teknoeats.backend.dto.UserDTO;
import com.teknoeats.backend.dto.OrderDTO;
import com.teknoeats.backend.dto.OrderItemDTO;
import com.teknoeats.backend.model.Order;
import com.teknoeats.backend.model.Product;
import com.teknoeats.backend.model.User;
import com.teknoeats.backend.model.OrderItem;
import com.teknoeats.backend.repository.OrderRepository;
import com.teknoeats.backend.repository.ProductRepository;
import com.teknoeats.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    // ========== PRODUCT MANAGEMENT ==========

    public Product addProduct(Product product) {
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, Product updatedProduct) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setName(updatedProduct.getName());
        product.setPrice(updatedProduct.getPrice());
        product.setCategory(updatedProduct.getCategory());
        product.setImage(updatedProduct.getImage());
        product.setStock(updatedProduct.getStock());

        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    // ========== ORDER MANAGEMENT ==========

    public List<Order> getAllOrders() {
        return orderRepository.findAllOrderByCreatedAtDesc();
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public Order updateOrderStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(Order.OrderStatus.valueOf(status));
        return orderRepository.save(order);
    }

    // ========== USER MANAGEMENT ==========

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertUserToDTO)
                .collect(Collectors.toList());
    }

    public UserDTO createUser(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setPassword(request.getPassword()); // In production, hash this!
        user.setRole(User.Role.valueOf(request.getRole().replace(" ", "_")));

        User savedUser = userRepository.save(user);
        return convertUserToDTO(savedUser);
    }

    public UserDTO updateUser(Long id, UserDTO dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setPhoneNumber(dto.getPhoneNumber());

        if (dto.getRole() != null) {
            user.setRole(User.Role.valueOf(dto.getRole().replace(" ", "_")));
        }

        User savedUser = userRepository.save(user);
        return convertUserToDTO(savedUser);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    // ========== DASHBOARD STATISTICS ==========

    public DashboardStatsDTO getDashboardStats() {
        List<Order> allOrders = orderRepository.findAll();

        // Calculate total revenue from ALL delivered orders
        BigDecimal totalRevenue = allOrders.stream()
                .filter(o -> o.getStatus() == Order.OrderStatus.delivered)
                .map(Order::getTotal)
                .filter(total -> total != null) // Filter out null values
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Count orders by status
        long pendingCount = allOrders.stream()
                .filter(o -> o.getStatus() == Order.OrderStatus.pending)
                .count();

        long preparingCount = allOrders.stream()
                .filter(o -> o.getStatus() == Order.OrderStatus.preparing)
                .count();

        long readyCount = allOrders.stream()
                .filter(o -> o.getStatus() == Order.OrderStatus.ready)
                .count();

        long completedCount = allOrders.stream()
                .filter(o -> o.getStatus() == Order.OrderStatus.delivered)
                .count();

        DashboardStatsDTO stats = new DashboardStatsDTO();
        stats.setTotalOrders(allOrders.size());
        stats.setTotalRevenue(totalRevenue != null ? totalRevenue : BigDecimal.ZERO);
        stats.setTotalUsers((int) userRepository.count());
        stats.setTotalProducts((int) productRepository.count());
        stats.setPendingOrders((int) pendingCount);
        stats.setPreparingOrders((int) preparingCount);
        stats.setReadyOrders((int) readyCount);
        stats.setCompletedOrders((int) completedCount);

        return stats;
    }

    // Helper method
    private UserDTO convertUserToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setRole(user.getRole().toString().replace("_", " "));
        return dto;
    }

    // Helper method to convert Order to OrderDTO
    public OrderDTO convertOrderToDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setUserId(order.getUser() != null ? order.getUser().getId() : null);
        dto.setStatus(order.getStatus().toString());
        dto.setTotal(order.getTotal());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setPickupTime(order.getPickupTime());
        dto.setRestaurant(order.getRestaurant());
        
        // Format createdAt
        if (order.getCreatedAt() != null) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            dto.setCreatedAt(order.getCreatedAt().format(formatter));
        }
        
        // Convert items
        if (order.getItems() != null && !order.getItems().isEmpty()) {
            List<OrderItemDTO> itemDTOs = order.getItems().stream()
                .map(item -> {
                    OrderItemDTO itemDTO = new OrderItemDTO();
                    itemDTO.setProductId(item.getProduct() != null ? item.getProduct().getId() : null);
                    itemDTO.setName(item.getProduct() != null ? item.getProduct().getName() : "Unknown");
                    itemDTO.setQuantity(item.getQuantity());
                    itemDTO.setPrice(item.getPrice());
                    itemDTO.setCategory(item.getProduct() != null ? item.getProduct().getCategory() : null);
                    itemDTO.setImage(item.getProduct() != null ? item.getProduct().getImage() : "/placeholder.svg");
                    return itemDTO;
                })
                .collect(Collectors.toList());
            dto.setItems(itemDTOs);
        }
        
        return dto;
    }
}