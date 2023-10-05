package com.ductm.imagesPost.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ductm.imagesPost.entity.Post;

public interface PostRepository extends JpaRepository<Post, Long> {

}
