package com.ductm.imagesPost.repository;

import com.ductm.imagesPost.entity.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ImageRepository extends JpaRepository<Image, Long> {
    List<Image> findAllByPostId(long id);

    @Transactional
    List<Image> deleteByName(String name);

}
