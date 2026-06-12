package com.vn.chamviet.chamviet_api.product.repository;

import com.vn.chamviet.chamviet_api.product.Component;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.persistence.LockModeType;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface ComponentRepo extends JpaRepository<Component, Long> {
    Optional<Component> findBySku(String sku);

    List<Component> findByComponentType(Component.ComponentType componentType);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select c from Component c where c.id in :ids")
    List<Component> findAllByIdInForUpdate(@Param("ids") Collection<Long> ids);
}
