package com.ductm.imagesPost.mapper;

import com.ductm.imagesPost.dto.NewPostDTO;
import com.ductm.imagesPost.dto.ViewPostDTO;
import com.ductm.imagesPost.entity.Post;
import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring",
        uses = ImageMapper.class,
        injectionStrategy = InjectionStrategy.CONSTRUCTOR
)
public abstract class PostMapper {
    public Post toEntity(NewPostDTO newPostDto) {
        Post post = new Post();
        post.setContent(newPostDto.getContent());
        post.setImages(ImageMapper.INSTANCE.toImages(newPostDto.getImages(), post));
        return post;
    }

    public abstract ViewPostDTO toViewDTO(Post post);


}
