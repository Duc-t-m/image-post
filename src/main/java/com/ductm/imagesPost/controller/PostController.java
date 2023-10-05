package com.ductm.imagesPost.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ductm.imagesPost.dto.PostDTO;
import com.ductm.imagesPost.entity.Image;
import com.ductm.imagesPost.entity.Post;
import com.ductm.imagesPost.mapper.PostMapper;
import com.ductm.imagesPost.repository.ImageRepository;
import com.ductm.imagesPost.repository.PostRepository;
import com.ductm.imagesPost.service.ImageSavingService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.RequestParam;

@CrossOrigin
@RestController
@RequestMapping("/posts")
@AllArgsConstructor
public class PostController {

    PostRepository postRepository;
    PostMapper postMapper;
    ImageRepository imageRepository;
    ImageSavingService imageSavingService;

    final Logger logger = LoggerFactory.getLogger(PostController.class);

    @GetMapping("")
    Page<PostDTO> getAllPost(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "3") int size) {
        return this.postRepository
                .findAll(PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id")))
                .map(postMapper::toDto);
    }

    @PostMapping("")
    Post addPost(@RequestBody PostDTO postDto) {
        Post post = this.postMapper.toEntity(postDto);
        return this.postRepository.save(post);
    }

    @DeleteMapping("/{id}")
    void removePost(@PathVariable long id) {
        List<Image> images = this.imageRepository.findAllByPostId(id);
        this.postRepository.deleteById(id);
        this.imageSavingService.removeFromLocal(images);
    }
}
