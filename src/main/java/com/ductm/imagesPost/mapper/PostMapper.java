package com.ductm.imagesPost.mapper;

import com.ductm.imagesPost.dto.PostDTO;
import com.ductm.imagesPost.entity.Post;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = ImageMapper.class)
public interface PostMapper {

    Post toEntity(PostDTO postDto);

    PostDTO toDto(Post post);
}
