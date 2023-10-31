package com.ductm.imagesPost.mapper;

import com.ductm.imagesPost.dto.NewPostDTO;
import com.ductm.imagesPost.dto.ViewPostDTO;
import com.ductm.imagesPost.entity.Post;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = ImageMapper.class)
public interface PostMapper {

    @Mapping(target = "id", ignore = true)
    Post toEntity(NewPostDTO newPostDto);

    ViewPostDTO toViewDTO(Post post);


}
