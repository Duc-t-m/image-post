package com.ductm.imagesPost.controller;

import com.ductm.imagesPost.repository.ImageRepository;
import com.ductm.imagesPost.service.ImageSavingService;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/images")
@AllArgsConstructor
public class ImageController {

    ImageRepository imageRepository;
    ImageSavingService imageSavingService;
    final Logger logger = LoggerFactory.getLogger(ImageController.class);
    
    @DeleteMapping(path = "/{image}")
    void removeFromLocal(@PathVariable String image) {
        this.imageRepository.deleteByPath(image);
        this.imageSavingService.removeOneFromLocal(image);
    }
}
