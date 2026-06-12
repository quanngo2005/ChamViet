package com.vn.chamviet.chamviet_api.product.repository;

import com.vn.chamviet.chamviet_api.product.Component;
import com.vn.chamviet.chamviet_api.product.ComponentContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComponentContentRepo extends JpaRepository<ComponentContent, Long> {
    List<ComponentContent> findByComponentComponentType(Component.ComponentType componentType);
}
