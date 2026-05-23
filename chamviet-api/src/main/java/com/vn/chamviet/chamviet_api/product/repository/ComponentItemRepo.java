package com.vn.chamviet.chamviet_api.product.repository;

import com.vn.chamviet.chamviet_api.product.ComponentItem;
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
public interface ComponentItemRepo extends JpaRepository<ComponentItem, Long> {
    Optional<ComponentItem> findBySku(String sku);

    List<ComponentItem> findByComponentType(ComponentItem.ComponentType componentType);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select c from ComponentItem c where c.id in :ids")
    List<ComponentItem> findAllByIdInForUpdate(@Param("ids") Collection<Long> ids);
}
