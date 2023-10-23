package com.ductm.imagesPost.controller;

import com.ductm.imagesPost.dto.ImageDTO;
import com.ductm.imagesPost.mapper.ImageMapper;
import com.ductm.imagesPost.repository.ImageRepository;
import com.ductm.imagesPost.service.ImageSavingService;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RestController
@RequestMapping("/images")
@AllArgsConstructor
public class ImageController {

    ImageRepository imageRepository;
    ImageSavingService imageSavingService;
    ImageMapper imageMapper;

    final Logger logger = LoggerFactory.getLogger(ImageController.class);

    @PostMapping(path = "/local")
    ResponseEntity<List<String>> saveToLocal(@RequestPart MultipartFile[] images) {
        List<String> imagesName = this.imageSavingService.saveToLocal(images);
        return ResponseEntity.ok(imagesName);
    }

    @PostMapping(path = "")
    void saveToDatabase(@RequestBody ImageDTO[] images) {
        this.imageRepository.saveAll(Stream.of(images).map(imageMapper::toEntity).collect(Collectors.toList()));
    }

    @DeleteMapping(path = "/{image}")
    void removeFromLocal(@PathVariable String image) {
        this.imageRepository.deleteByPath(image);
        this.imageSavingService.removeOneFromLocal(image);
    }
}
