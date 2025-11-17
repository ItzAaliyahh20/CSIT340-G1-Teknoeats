package com.teknoeats.backend.dto;

import java.math.BigDecimal;

public class DashboardStatsDTO {
    private Integer totalOrders;
    private BigDecimal totalRevenue;
    private Integer totalUsers;
    private Integer totalProducts;
    private Integer pendingOrders;
    private Integer preparingOrders;
    private Integer readyOrders;
    private Integer completedOrders;
    private Integer completedToday;
    private BigDecimal revenueToday;

    // Default Constructor
    public DashboardStatsDTO() {}

    // Constructor with all fields
    public DashboardStatsDTO(Integer totalOrders, BigDecimal totalRevenue, Integer totalUsers,
                             Integer totalProducts, Integer pendingOrders, Integer preparingOrders,
                             Integer readyOrders, Integer completedOrders, Integer completedToday,
                             BigDecimal revenueToday) {
        this.totalOrders = totalOrders;
        this.totalRevenue = totalRevenue;
        this.totalUsers = totalUsers;
        this.totalProducts = totalProducts;
        this.pendingOrders = pendingOrders;
        this.preparingOrders = preparingOrders;
        this.readyOrders = readyOrders;
        this.completedOrders = completedOrders;
        this.completedToday = completedToday;
        this.revenueToday = revenueToday;
    }

    // Getters and Setters
    public Integer getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(Integer totalOrders) {
        this.totalOrders = totalOrders;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public Integer getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(Integer totalUsers) {
        this.totalUsers = totalUsers;
    }

    public Integer getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(Integer totalProducts) {
        this.totalProducts = totalProducts;
    }

    public Integer getPendingOrders() {
        return pendingOrders;
    }

    public void setPendingOrders(Integer pendingOrders) {
        this.pendingOrders = pendingOrders;
    }

    public Integer getPreparingOrders() {
        return preparingOrders;
    }

    public void setPreparingOrders(Integer preparingOrders) {
        this.preparingOrders = preparingOrders;
    }

    public Integer getReadyOrders() {
        return readyOrders;
    }

    public void setReadyOrders(Integer readyOrders) {
        this.readyOrders = readyOrders;
    }

    public Integer getCompletedOrders() {
        return completedOrders;
    }

    public void setCompletedOrders(Integer completedOrders) {
        this.completedOrders = completedOrders;
    }

    public Integer getCompletedToday() {
        return completedToday;
    }

    public void setCompletedToday(Integer completedToday) {
        this.completedToday = completedToday;
    }

    public BigDecimal getRevenueToday() {
        return revenueToday;
    }

    public void setRevenueToday(BigDecimal revenueToday) {
        this.revenueToday = revenueToday;
    }
}
