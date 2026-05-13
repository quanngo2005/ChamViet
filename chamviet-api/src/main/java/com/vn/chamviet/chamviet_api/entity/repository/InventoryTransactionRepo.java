package com.vn.chamviet.chamviet_api.entity.repository;

import com.vn.chamviet.chamviet_api.entity.InventoryTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryTransactionRepo extends JpaRepository<InventoryTransaction, Long> {
    List<InventoryTransaction> findByReferenceIdOrderByIdAsc(Long referenceId);
}
