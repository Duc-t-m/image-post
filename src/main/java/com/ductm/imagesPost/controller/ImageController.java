package com.ductm.imagesPost.controller;

import com.ductm.imagesPost.entity.Image;
import com.ductm.imagesPost.entity.Post;
import com.ductm.imagesPost.mapper.ImageMapper;
import com.ductm.imagesPost.repository.ImageRepository;
import com.ductm.imagesPost.repository.PostRepository;
import com.ductm.imagesPost.service.ImageSavingService;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/images")
@AllArgsConstructor
public class ImageController {

    ImageRepository imageRepository;
    ImageSavingService imageSavingService;
    ImageMapper imageMapper;
    PostRepository postRepository;
    final Logger logger = LoggerFactory.getLogger(ImageController.class);

    @PostMapping("/{postId}")
    ResponseEntity<?> updateImages(
            @PathVariable long postId,
            @RequestPart @Nullable MultipartFile[] imagesToAdd,
            @RequestPart @Nullable String[] imagesToRemove
    ) {
        Post post = postRepository.getReferenceById(postId);
        if (imagesToAdd == null)
            imagesToAdd = new MultipartFile[0];
        if (imagesToRemove == null)
            imagesToRemove = new String[0];

        List<Image> newImages = imageRepository.saveAll(imageMapper.filesToImages(imagesToAdd, post));
        if (imagesToRemove.length > 0)
            imageRepository.deleteByPathIn(imagesToRemove);

        try {
            this.imageSavingService.saveToLocal(imagesToAdd, newImages);
            this.imageSavingService.removeFromLocal(imagesToRemove);
        } catch (Exception e) {
            logger.error("Error when updating images, try again later!");
            return ResponseEntity.internalServerError().body("Error when updating images, try again later!");
        }
        return ResponseEntity.ok(imageMapper.imagesToPaths(newImages));
    }
}
