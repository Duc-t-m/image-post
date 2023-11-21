package com.ductm.imagesPost.repository;

import com.ductm.imagesPost.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {
}
