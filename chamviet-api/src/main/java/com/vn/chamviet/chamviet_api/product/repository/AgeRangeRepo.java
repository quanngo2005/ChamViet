package com.vn.chamviet.chamviet_api.product.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vn.chamviet.chamviet_api.product.AgeRange;

@Repository
public interface AgeRangeRepo extends JpaRepository<AgeRange, Integer> {

}
