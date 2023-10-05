package com.ductm.imagesPost.mapper;

import org.mapstruct.Mapper;

import com.ductm.imagesPost.dto.PostDTO;
import com.ductm.imagesPost.entity.Image;
import com.ductm.imagesPost.entity.Post;
@Mapper(componentModel = "spring")
public abstract class PostMapper {
	public abstract Post toEntity(PostDTO postDto);
	
	protected Image pathToImage(String path) {
		Image image = new Image();
		image.setPath(path);
		return image;
	}
	
	public abstract PostDTO toDto(Post post);
	
	protected String imageToPath(Image image) {
		return image.getPath();
	}
}
