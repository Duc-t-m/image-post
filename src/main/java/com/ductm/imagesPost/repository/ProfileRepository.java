package com.ductm.imagesPost.repository;

import com.ductm.imagesPost.entity.Profile;
import com.ductm.imagesPost.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfileRepository extends JpaRepository<Profile, User> {
    boolean existsByPhone(String phone);
}
