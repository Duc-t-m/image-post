package com.ductm.imagesPost.repository;

import com.ductm.imagesPost.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 *
 * @author tranm
 */
public interface UserRepository extends JpaRepository<Account, Long> {

    Optional<Account> findByUsername(String username);

}
