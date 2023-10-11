package com.ductm.imagesPost.mapper;

import org.mapstruct.Mapper;

import com.ductm.imagesPost.dto.PostDTO;
import com.ductm.imagesPost.entity.Post;

@Mapper(componentModel = "spring", uses = ImageMapper.class)
public abstract class PostMapper {

    public abstract Post toEntity(PostDTO postDto);

    public abstract PostDTO toDto(Post post);
}
