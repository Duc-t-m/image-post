package com.ductm.imagesPost.repository;

import com.ductm.imagesPost.entity.Account;
import com.ductm.imagesPost.entity.Profile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfileRepository extends JpaRepository<Profile, Account> {
    boolean existsByPhone(String phone);
}
