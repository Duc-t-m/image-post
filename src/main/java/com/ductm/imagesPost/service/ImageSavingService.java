package com.ductm.imagesPost.service;

import com.ductm.imagesPost.config.AppProperties;
import com.ductm.imagesPost.entity.Image;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
@Slf4j
public class ImageSavingService {
    private final Path path;

    public ImageSavingService(AppProperties props) {
        path = Paths.get(props.getImg().getPath());
    }

    public void saveAllToLocal(MultipartFile[] images, List<Image> imageNames) throws IOException {
        //create images folder if not exist
        if (!Files.exists(path)) {
            try {
                Files.createDirectories(path);
            } catch (IOException e) {
                log.error(e.getMessage());
                throw new IOException("Can't create images folder, try again later!");
            }
        }
        for (int i = 0; i < images.length; i++) {
            saveToLocal(images[i], imageNames.get(i).getName());
        }
    }

    public void saveToLocal(MultipartFile image, String imageName) throws IOException {
        try (InputStream fileInputStream = image.getInputStream()) {
            Files.copy(fileInputStream, path.resolve(imageName));
        } catch (IOException e) {
            log.error(e.getMessage());
            throw new IOException("Can't save image, try again later!");
        }
    }

    public void removeAllFromLocal(List<Image> images) throws IOException {
        for (Image image : images) {
            removeFromLocal(image);
        }
    }

    public void removeFromLocal(Image image) throws IOException {
        try {
            Files.deleteIfExists(path.resolve(image.getName()));
        } catch (IOException e) {
            log.error(e.getMessage());
            throw new IOException("Can't delete image, try again later!");
        }
    }
}
