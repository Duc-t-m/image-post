package com.ductm.imagesPost.repository;

import com.ductm.imagesPost.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * @author tranm
 */
public interface AccountRepository extends JpaRepository<Account, Long> {

    Optional<Account> findByUsername(String username);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

}
