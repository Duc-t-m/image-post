package com.ductm.imagesPost.controller;

import com.ductm.imagesPost.mapper.ImageMapper;
import com.ductm.imagesPost.repository.ImageRepository;
import com.ductm.imagesPost.repository.PostRepository;
import com.ductm.imagesPost.service.ImageSavingService;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/images")
@AllArgsConstructor
public class ImageController {

    ImageRepository imageRepository;
    ImageSavingService imageSavingService;
    ImageMapper imageMapper;
    PostRepository postRepository;
    final Logger logger = LoggerFactory.getLogger(ImageController.class);
}
