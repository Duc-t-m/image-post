package com.ductm.imagesPost;

import com.ductm.imagesPost.config.AppProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(AppProperties.class)
public class ImagesPostApplication {
    public static void main(String[] args) {
        SpringApplication.run(ImagesPostApplication.class, args);
    }

}
