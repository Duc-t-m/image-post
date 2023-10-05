package com.ductm.imagesPost.controller;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ductm.imagesPost.dto.ImageDTO;
import com.ductm.imagesPost.dto.PostDTO;
import com.ductm.imagesPost.entity.Post;
import com.ductm.imagesPost.mapper.ImageMapper;
import com.ductm.imagesPost.mapper.PostMapper;
import com.ductm.imagesPost.repository.ImageRepository;
import com.ductm.imagesPost.repository.PostRepository;
import com.ductm.imagesPost.service.ImageSavingService;
import lombok.AllArgsConstructor;

@CrossOrigin
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
