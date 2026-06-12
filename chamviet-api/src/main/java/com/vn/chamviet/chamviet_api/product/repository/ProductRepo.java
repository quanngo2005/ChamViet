package com.vn.chamviet.chamviet_api.product.repository;

import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vn.chamviet.chamviet_api.product.Product;

@Repository
public interface ProductRepo extends JpaRepository<Product, Long> {
    List<Product> findByName(String name);
    List<Product> findByCategoryId(Integer categoryId);

    @EntityGraph(attributePaths = {
        "category",
        "images",
        "variants",
        "variants.components",
        "variants.components.component",
        "variants.components.component.ageRange",
        "variants.components.component.content"
    })
    java.util.Optional<Product> findById(Long id);
}
