package com.ductm.imagesPost.dto;

import lombok.Data;

@Data
public class PostDTO {

    private long id;
    private String content;
    private ImageDTO[] images;
}
