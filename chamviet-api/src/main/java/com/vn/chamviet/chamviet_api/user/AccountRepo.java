package com.vn.chamviet.chamviet_api.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccountRepo extends JpaRepository<Account, Long> {
    Optional<Account> findByEmail(String email);
    Optional<Account> findByEmailAndStatus(String email, Account.AccountStatus status);
    Optional<Account> findByIdAndStatus(Long id, Account.AccountStatus status);
}
