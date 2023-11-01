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

    public String[] toPaths(List<Image> images) {
        String[] result = new String[images.size()];
        for (int i = 0; i < images.size(); i++) {
            result[i] = images.get(i).getPath();
        }
        return result;
    }

    public List<Image> toImages(MultipartFile[] files, Post post) {
        List<Image> result = new ArrayList<>();
        String saveName, originalName;
        Image image;
        for (MultipartFile f : files) {
            image = new Image();
            saveName = UUID.randomUUID().toString();
            originalName = f.getOriginalFilename();
            assert originalName != null;
            saveName += originalName.substring(originalName.lastIndexOf("."));
            image.setPath(saveName);
            image.setPost(post);
            result.add(image);
        }
        return result;
    }
}
