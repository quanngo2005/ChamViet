package com.vn.chamviet.chamviet_api.product.repository;

import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.vn.chamviet.chamviet_api.product.ProductVariant;

@Repository
public interface ProductVariantRepo extends JpaRepository<ProductVariant, Long> {
    List<ProductVariant> findByProductId(Long productId);

    @Query("""
        select distinct pv
        from ProductVariant pv
        left join fetch pv.product
        left join fetch pv.components pvc
        left join fetch pvc.component c
        left join fetch c.content
        left join fetch c.ageRange
        where pv.id = :id
        """)
    java.util.Optional<ProductVariant> findDetailedById(@Param("id") Long id);
}
