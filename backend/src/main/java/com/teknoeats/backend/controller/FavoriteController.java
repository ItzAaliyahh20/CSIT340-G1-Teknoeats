package com.teknoeats.backend.controller;

import java.util.List;

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
    public List<Favorite> getFavorites(@PathVariable String userId) {
        return favoriteService.getFavorites(userId);
    }

    @PostMapping("/add")
    public Favorite addFavorite(@RequestBody FavoriteRequest request) {
        return favoriteService.addFavorite(request.getUserId(), request.getMenuItemId());
    }

    @PostMapping("/remove")
    public void removeFavorite(@RequestBody FavoriteRequest request) {
        favoriteService.removeFavorite(request.getUserId(), request.getMenuItemId());
    }

    // DTO for requests
    public static class FavoriteRequest {
        private String userId;
        private Long menuItemId;

        public String getUserId() { return userId; }
        public void setUserId(String userId) { this.userId = userId; }

        public Long getMenuItemId() { return menuItemId; }
        public void setMenuItemId(Long menuItemId) { this.menuItemId = menuItemId; }
    }
}
