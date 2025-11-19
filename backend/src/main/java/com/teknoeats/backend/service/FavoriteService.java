package com.teknoeats.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.teknoeats.backend.model.Favorite;
import com.teknoeats.backend.model.MenuItem;
import com.teknoeats.backend.repository.FavoriteRepository;
import com.teknoeats.backend.repository.MenuItemRepository;

@Service
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final MenuItemRepository menuItemRepository;

    public FavoriteService(FavoriteRepository favoriteRepository, MenuItemRepository menuItemRepository) {
        this.favoriteRepository = favoriteRepository;
        this.menuItemRepository = menuItemRepository;
    }

    public List<Favorite> getFavorites(String userId) {
        return favoriteRepository.findByUserId(userId);
    }

    public Favorite addFavorite(String userId, Long menuItemId) {
    MenuItem item = menuItemRepository.findById(menuItemId)
            .orElseThrow(() -> new RuntimeException("Item not found"));

    Favorite favorite = new Favorite();
    favorite.setUserId(userId);
    favorite.setMenuItem(item);

    return favoriteRepository.save(favorite);
}

    public void removeFavorite(String userId, Long menuItemId) {
        favoriteRepository.deleteByUserIdAndMenuItemId(userId, menuItemId);
    }
}
