package com.teknoeats.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.teknoeats.backend.model.Favorite;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findByUserId(Long userId);
    void deleteByUserIdAndProductId(Long userId, Long productId);
}
