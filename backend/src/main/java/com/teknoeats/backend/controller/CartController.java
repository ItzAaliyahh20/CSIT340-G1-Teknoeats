package com.teknoeats.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.teknoeats.backend.dto.ApiResponse;
import com.teknoeats.backend.model.Cart;
import com.teknoeats.backend.service.CartService;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping("/{userId}")
    public List<Cart> getCart(@PathVariable Long userId) {
        return cartService.getCart(userId);
    }

    @PostMapping("/add")
    public ApiResponse<Cart> addToCart(@RequestBody CartRequest request) {
        Cart cart = cartService.addToCart(request.getUserId(), request.getProductId(), request.getQuantity());
        return new ApiResponse<>(true, "Item added to cart successfully", cart);
    }

    @PostMapping("/remove")
    public ApiResponse<Void> removeFromCart(@RequestBody CartRequest request) {
        cartService.removeFromCart(request.getUserId(), request.getProductId());
        return new ApiResponse<>(true, "Item removed from cart successfully", null);
    }

    // DTO for requests
    public static class CartRequest {
        private Long userId;
        private Long productId;
        private Integer quantity;

        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }

        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }

        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
    }
}