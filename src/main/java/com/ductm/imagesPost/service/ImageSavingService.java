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
import java.util.List;

@Service
public class ImageSavingService {

    private final Logger logger = LoggerFactory.getLogger(ImageSavingService.class);

    public void saveToLocal(MultipartFile[] images, List<Image> imageNames) throws IOException {
        Path path = Paths.get("frontend/src/assets/images");
        //create images folder if not exist
        if (!Files.exists(path)) {
            try {
                Files.createDirectories(path);
            } catch (IOException e) {
                logger.error(e.getMessage());
                throw new IOException("Can't create images folder, try again later!");
            }
        }
        for (int i = 0; i < images.length; i++) {
            try (InputStream fileInputStream = images[i].getInputStream()) {
                Files.copy(fileInputStream, path.resolve(imageNames.get(i).getPath()));
            } catch (IOException e) {
                logger.error(e.getMessage());
                throw new IOException("Can't save images, try again later!");
            }
        }
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

    //overload removeFromLocal method with a parameter String[] paths
    public void removeFromLocal(String[] images) {
        Path path = Paths.get("frontend/src/assets/images");
        for (String image : images) {
            try {
                Files.deleteIfExists(path.resolve(image));
            } catch (IOException e) {
                logger.error(e.getMessage());
            }
        }
    }
}
