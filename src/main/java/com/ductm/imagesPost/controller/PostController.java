package com.ductm.imagesPost.controller;

import com.ductm.imagesPost.dto.NewPostDTO;
import com.ductm.imagesPost.dto.ViewPostDTO;
import com.ductm.imagesPost.entity.Image;
import com.ductm.imagesPost.entity.Post;
import com.ductm.imagesPost.mapper.PostMapper;
import com.ductm.imagesPost.repository.ImageRepository;
import com.ductm.imagesPost.repository.PostRepository;
import com.ductm.imagesPost.service.ImageSavingService;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

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
    Page<ViewPostDTO> getAllPost(@RequestParam(defaultValue = "0") int page,
                                 @RequestParam(defaultValue = "3") int size) {
        return postRepository
                .findAll(PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id")))
                .map(postMapper::toViewDTO);
    }

    @PostMapping("")
    ResponseEntity<String> addPost(@RequestBody NewPostDTO newPostDto) {
        Post post = postRepository.save(postMapper.toEntity(newPostDto));
        try {
            imageSavingService.saveToLocal(newPostDto.getImages(), post.getImages());
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
        return ResponseEntity.accepted().body("Post added!");
    }

    @DeleteMapping("/{id}")
    void removePost(@PathVariable long id) {
        List<Image> images = imageRepository.findAllByPostId(id);
        postRepository.deleteById(id);
        imageSavingService.removeFromLocal(images);
    }

    @PutMapping("/{id}")
    ResponseEntity<String> updatePost(@PathVariable long id, @RequestBody NewPostDTO newPostDto) {
        Post post = new Post();
        post.setId(id);
        post.setContent(newPostDto.getContent());
        postRepository.save(post);
        return ResponseEntity.accepted().body("Post updated!");
    }
}
