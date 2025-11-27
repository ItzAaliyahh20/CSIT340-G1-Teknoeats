package com.teknoeats.backend.controller;

import java.util.List;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.teknoeats.backend.model.Favorite;
import com.teknoeats.backend.service.FavoriteService;

@RestController
@RequestMapping("/api/favorites")
@CrossOrigin(origins = "*")
public class FavoriteController {

    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @GetMapping("/{userId}")
    public List<Favorite> getFavorites(@PathVariable Long userId) {
        return favoriteService.getFavorites(userId);
    }

    @PostMapping("/add")
    public Favorite addFavorite(@RequestBody FavoriteRequest request) {
        return favoriteService.addFavorite(request.getUserId(), request.getProductId());
    }

    @PostMapping("/remove")
    @Transactional
    public void removeFavorite(@RequestBody FavoriteRequest request) {
        favoriteService.removeFavorite(request.getUserId(), request.getProductId());
    }

    // DTO for requests
    public static class FavoriteRequest {
        private Long userId;
        private Long productId;

        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }

        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }
    }
}
