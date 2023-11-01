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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
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

    @PostMapping("")
    ResponseEntity<?> updateImages(
            @RequestPart String postId,
            @RequestPart MultipartFile[] imagesToAdd,
            @RequestPart String[] imagesToRemove
    ) {
        long id = Long.parseLong(postId);
        Post post = postRepository.getReferenceById(id);

        List<Image> newImages = imageRepository.saveAll(imageMapper.filesToImages(imagesToAdd, post));
        List<Image> deletedImages = imageMapper.pathsToImages(imagesToRemove, post);
        imageRepository.deleteAll(deletedImages);
        
        try {
            this.imageSavingService.saveToLocal(imagesToAdd, newImages);
            this.imageSavingService.removeFromLocal(deletedImages);
        } catch (Exception e) {
            logger.error("Error when updating images, try again later!");
            return ResponseEntity.internalServerError().body("Error when updating images, try again later!");
        }
        return ResponseEntity.ok(imageMapper.imagesToPaths(imageRepository.findAllByPostId(id)));
    }
}
