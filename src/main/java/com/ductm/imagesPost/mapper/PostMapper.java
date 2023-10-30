package com.ductm.imagesPost.mapper;

import com.ductm.imagesPost.dto.NewPostDTO;
import com.ductm.imagesPost.dto.ViewPostDTO;
import com.ductm.imagesPost.entity.Post;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = ImageMapper.class)
public abstract class PostMapper {

    @Mapping(target = "id", ignore = true)
    public abstract Post toEntity(NewPostDTO newPostDto);

    public abstract ViewPostDTO toViewDTO(Post post);


}
