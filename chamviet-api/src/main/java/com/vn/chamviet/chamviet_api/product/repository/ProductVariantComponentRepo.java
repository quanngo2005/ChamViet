package com.vn.chamviet.chamviet_api.product.repository;

import com.vn.chamviet.chamviet_api.product.ProductVariantComponent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductVariantComponentRepo extends JpaRepository<ProductVariantComponent, Long> {
    List<ProductVariantComponent> findByProductVariantIdOrderBySortOrderAsc(Long productVariantId);
}
