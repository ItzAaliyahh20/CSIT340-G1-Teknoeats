package com.teknoeats.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.teknoeats.backend.model.MenuItem;

public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {}