package com.vn.chamviet.chamviet_api.entity.repository;

import com.vn.chamviet.chamviet_api.entity.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VoucherRepo extends JpaRepository<Voucher, Long> {
}
