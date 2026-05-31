package com.vn.chamviet.chamviet_api.entity.repository;

import com.vn.chamviet.chamviet_api.order.Orders;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrdersRepo extends JpaRepository<Orders, Long> {
    @EntityGraph(attributePaths = {
        "account",
        "voucher",
        "orderDetails",
        "orderDetails.productVariant",
        "orderLogs"
    })
    Optional<Orders> findById(Long id);
}
