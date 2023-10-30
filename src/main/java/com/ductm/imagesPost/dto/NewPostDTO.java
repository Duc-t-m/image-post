package com.ductm.imagesPost.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class NewPostDTO {
    private String content;
    private MultipartFile[] images;
}
