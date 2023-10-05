package com.ductm.imagesPost.repository;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ductm.imagesPost.entity.Image;

public interface ImageRepository extends JpaRepository<Image, Long>{
	public List<Image> findAllByPostId(long id);
	@Transactional
	public void	deleteByPath(String path);
}
