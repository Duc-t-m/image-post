package com.ductm.imagesPost.service;

import com.ductm.imagesPost.entity.Image;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ImageSavingService {

    private final Logger logger = LoggerFactory.getLogger(ImageSavingService.class);

    public List<String> saveToLocal(MultipartFile[] images) {
        Path path = Paths.get("frontend/src/assets/images");
        //create images folder if not exist
        if (!Files.exists(path)) {
            try {
                Files.createDirectories(path);
            } catch (IOException e) {
                logger.error(e.getMessage());
            }
        }
        List<String> imageNames = new ArrayList<>();
        String saveName, originalName;
        for (MultipartFile f : images) {
            saveName = UUID.randomUUID().toString();
            originalName = f.getOriginalFilename();
            assert originalName != null;
            saveName += originalName.substring(originalName.lastIndexOf("."));

            try (InputStream fileInputStream = f.getInputStream()) {
                Files.copy(fileInputStream, path.resolve(saveName));
                imageNames.add(saveName);
            } catch (IOException e) {
                logger.error(e.getMessage());
            }
        }
        return imageNames;
    }

    public void removeFromLocal(List<Image> images) {
        Path path = Paths.get("frontend/src/assets/images");
        for (Image image : images) {
            try {
                Files.deleteIfExists(path.resolve(image.getPath()));
            } catch (IOException e) {
                logger.error(e.getMessage());
            }
        }
    }

    public void removeOneFromLocal(String image) {
        Path path = Paths.get("frontend/src/assets/images");
        try {
            Files.deleteIfExists(path.resolve(image));
        } catch (IOException e) {
            logger.error(e.getMessage());
        }
    }
}
