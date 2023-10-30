package com.ductm.imagesPost.dto;

import lombok.Data;

@Data
public class ViewPostDTO {
    private long id;
    private String content;
    private String[] images;
}
