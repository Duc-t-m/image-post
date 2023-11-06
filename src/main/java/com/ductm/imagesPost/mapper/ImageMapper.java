package com.ductm.imagesPost.mapper;

import com.ductm.imagesPost.entity.Image;
import com.ductm.imagesPost.entity.Post;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Mapper(componentModel = "spring")
public abstract class ImageMapper {
    static ImageMapper INSTANCE = Mappers.getMapper(ImageMapper.class);

    public String[] imagesToPaths(List<Image> images) {
        String[] result = new String[images.size()];
        for (int i = 0; i < images.size(); i++) {
            result[i] = images.get(i).getName();
        }
        return result;
    }

    public List<Image> filesToImages(MultipartFile[] files, Post post) {
        List<Image> result = new ArrayList<>();
        Image image;
        for (MultipartFile f : files) {
            image = fileToImage(f, post);
            result.add(image);
        }
        return result;
    }

    public Image fileToImage(MultipartFile file, Post post) {
        Image image = new Image();
        String saveName = UUID.randomUUID().toString();
        String originalName = file.getOriginalFilename();
        assert originalName != null;
        saveName += originalName.substring(originalName.lastIndexOf("."));
        image.setName(saveName);
        image.setPost(post);
        return image;
    }
}
