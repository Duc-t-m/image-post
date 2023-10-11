package com.ductm.imagesPost.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.ductm.imagesPost.dto.ImageDTO;
import com.ductm.imagesPost.entity.Image;
import com.ductm.imagesPost.entity.Post;

@Mapper(componentModel = "spring")
public abstract class ImageMapper {

    @Mapping(target = "id", ignore = true)
    public abstract Image toEntity(ImageDTO imageDto);

    protected Post idToPost(long id) {
        Post post = new Post();
        post.setId(id);
        return post;
    }

    public abstract ImageDTO toDto(Image image);

    protected long PostToId(Post post) {
        return post.getId();
    }
}
