package com.ductm.imagesPost.controller;

import com.ductm.imagesPost.dto.NewPostDTO;
import com.ductm.imagesPost.dto.ViewPostDTO;
import com.ductm.imagesPost.entity.Image;
import com.ductm.imagesPost.entity.Post;
import com.ductm.imagesPost.mapper.ImageMapper;
import com.ductm.imagesPost.mapper.PostMapper;
import com.ductm.imagesPost.repository.ImageRepository;
import com.ductm.imagesPost.repository.PostRepository;
import com.ductm.imagesPost.service.ImageSavingService;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.SortDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/posts")
@AllArgsConstructor
public class PostController {

    PostRepository postRepository;
    PostMapper postMapper;
    ImageRepository imageRepository;
    ImageSavingService imageSavingService;
    ImageMapper imageMapper;
    final Logger logger = LoggerFactory.getLogger(PostController.class);

    @GetMapping("")
    Page<ViewPostDTO> getPage(
            @PageableDefault(size = 3)
            @SortDefault(sort = "id", direction = Sort.Direction.DESC)
            Pageable page
    ) {
        return postRepository
                .findAll(page)
                .map(postMapper::toViewDTO);
    }

    @PostMapping("")
    ResponseEntity<String> addPost(@RequestPart String content, @RequestPart MultipartFile[] images) {
        NewPostDTO newPostDto = new NewPostDTO(content, images);
        Post post = postRepository.save(postMapper.toEntity(newPostDto));
        try {
            imageSavingService.saveAllToLocal(newPostDto.getImages(), post.getImages());
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Error when saving images, try again later!");
        }
        return ResponseEntity.ok("Post added!");
    }

    @DeleteMapping("/{id}")
    ResponseEntity<String> removePost(@PathVariable long id) {
        List<Image> images = new ArrayList<>(imageRepository.findAllByPostId(id));
        postRepository.deleteById(id);
        try {
            imageSavingService.removeAllFromLocal(images);
            return ResponseEntity.ok("Post removed!");
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    ResponseEntity<?> updatePost(@PathVariable long id, @RequestPart String content, @RequestPart MultipartFile[] images) {
        Post post = postRepository.getReferenceById(id);
        post.setContent(content);
        postRepository.save(post);

        Set<String> databaseImages = imageRepository.findAllByPostId(id)
                .stream()
                .map(Image::getName)
                .collect(Collectors.toSet());
        Set<String> newImages = Arrays.stream(images)
                .map(MultipartFile::getOriginalFilename)
                .collect(Collectors.toSet());
        Image temp;
        try {
            for (MultipartFile f : images) {
                if (databaseImages.contains(f.getOriginalFilename()))
                    continue;
                temp = imageRepository.save(imageMapper.fileToImage(f, post));
                imageSavingService.saveToLocal(f, temp.getName());
            }
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
        try {
            for (String imageName : databaseImages) {
                if (newImages.contains(imageName))
                    continue;
                temp = imageRepository.deleteByName(imageName).get(0);
                imageSavingService.removeFromLocal(temp);
            }
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
        return ResponseEntity.ok(imageMapper.imagesToPaths(imageRepository.findAllByPostId(id)));
    }
}
