package com.teknoeats.backend.dto;

import java.math.BigDecimal;

public class OrderItemDTO {
    private Long productId;
    private String name;
    private Integer quantity;
    private BigDecimal price;
    private String category;
    private String image;

    // Default Constructor
    public OrderItemDTO() {}

    // Constructor with all fields
    public OrderItemDTO(Long productId, String name, Integer quantity, BigDecimal price, String category, String image) {
        this.productId = productId;
        this.name = name;
        this.quantity = quantity;
        this.price = price;
        this.category = category;
        this.image = image;
    }

    // Getters and Setters
    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }
}