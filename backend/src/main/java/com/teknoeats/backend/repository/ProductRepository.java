// ==================== FILE 1: PRODUCT REPOSITORY ====================
// Location: src/main/java/com/teknoeats/backend/repository/ProductRepository.java
// Just copy this ENTIRE file

package com.teknoeats.backend.repository;

import com.teknoeats.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Find all products by category (e.g., "Meals", "Foods", "Snacks", "Beverages")
    List<Product> findByCategory(String category);

    // Find products by name (case-insensitive search)
    List<Product> findByNameContainingIgnoreCase(String name);

    // Find products with stock greater than specified amount
    List<Product> findByStockGreaterThan(Integer stock);
}
