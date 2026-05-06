package com.teknoeats.backend.config;

import com.teknoeats.backend.model.Product;
import com.teknoeats.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Component
@Profile("dev") // Only runs in development environment
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Starting database seeding...");

        List<Product> seedProducts = Arrays.asList(
            new Product("Canteen Special", new BigDecimal("130.00"), "Meals", "/meals/canteenSpecial.png", 20),
            new Product("Tapa", new BigDecimal("85.00"), "Meals", "/meals/tapa.png", 20),
            new Product("Lechon Kawali", new BigDecimal("120.00"), "Meals", "/meals/lechonKawali.png", 20),
            new Product("Longganisa", new BigDecimal("95.00"), "Meals", "/meals/longganisa.png", 20),
            new Product("Tocino", new BigDecimal("100.00"), "Meals", "/meals/tocino.png", 20),
            new Product("Corned Beef", new BigDecimal("95.00"), "Meals", "/meals/cornedBeef.png", 20),
            new Product("Ham", new BigDecimal("95.00"), "Meals", "/meals/ham.png", 20),
            new Product("Siomai", new BigDecimal("85.00"), "Meals", "/meals/siomai.png", 20),

            new Product("Rice", new BigDecimal("50.00"), "Food", "/food/rice.png", 20),
            new Product("Fried Rice", new BigDecimal("60.00"), "Food", "/food/friedRice.png", 20),
            new Product("Pancit Bihon", new BigDecimal("80.00"), "Food", "/food/pancitBihon.png", 20),
            new Product("Sunny Side Up", new BigDecimal("50.00"), "Food", "/food/sunnySideUp.png", 20),
            new Product("Spaghetti", new BigDecimal("75.00"), "Food", "/food/spaghetti.png", 20),
            new Product("Pork Adobo", new BigDecimal("85.00"), "Food", "/food/porkAdobo.png", 20),
            new Product("Fried Chicken", new BigDecimal("90.00"), "Food", "/food/friedChicken.png", 20),
            new Product("Baguio Beans", new BigDecimal("40.00"), "Food", "/food/baguioBeans.png", 20),

            new Product("Hotcake", new BigDecimal("10.00"), "Snacks", "/snacks/hotcake.png", 20),
            new Product("Mango Float", new BigDecimal("55.00"), "Snacks", "/snacks/mangoFloat.png", 20),
            new Product("Meat Roll", new BigDecimal("20.00"), "Snacks", "/snacks/meatRoll.png", 20),
            new Product("Banana Cue", new BigDecimal("20.00"), "Snacks", "/snacks/bananaCue.png", 20),
            new Product("Nachos", new BigDecimal("70.00"), "Snacks", "/snacks/nachos.png", 20),
            new Product("Bread Loaf", new BigDecimal("85.00"), "Snacks", "/snacks/breadLoaf.png", 20),
            new Product("Kutsinta", new BigDecimal("15.00"), "Snacks", "/snacks/kutsinta.png", 20),
            new Product("Popcorn", new BigDecimal("40.00"), "Snacks", "/snacks/popcorn.png", 20),

            new Product("Iced Tea", new BigDecimal("30.00"), "Beverages", "/beverages/icedTea.png", 20),
            new Product("Orange Juice", new BigDecimal("35.00"), "Beverages", "/beverages/orangeJuice.png", 20),
            new Product("Coca Cola", new BigDecimal("25.00"), "Beverages", "/beverages/cola.png", 20),
            new Product("Sprite", new BigDecimal("25.00"), "Beverages", "/beverages/sprite.png", 20),
            new Product("Mango Shake", new BigDecimal("50.00"), "Beverages", "/beverages/mangoShake.png", 20),
            new Product("Mountain Dew", new BigDecimal("45.00"), "Beverages", "/beverages/mountainDew.png", 20),
            new Product("Coffee", new BigDecimal("40.00"), "Beverages", "/beverages/coffee.png", 20),
            new Product("Bottled Water", new BigDecimal("15.00"), "Beverages", "/beverages/bottledWater.png", 20)
        );

        for (Product seedProduct : seedProducts) {
            List<Product> existingProducts = productRepository.findByName(seedProduct.getName());
            if (existingProducts.isEmpty()) {
                // Insert new product
                productRepository.save(seedProduct);
                System.out.println("Inserted product: " + seedProduct.getName());
            } else {
                // Update existing product
                Product existing = existingProducts.get(0);
                existing.setPrice(seedProduct.getPrice());
                existing.setCategory(seedProduct.getCategory());
                existing.setImage(seedProduct.getImage());
                existing.setStock(seedProduct.getStock());
                productRepository.save(existing);
                System.out.println("Updated product: " + seedProduct.getName());
            }
        }

        System.out.println("Database seeding completed.");
    }
}