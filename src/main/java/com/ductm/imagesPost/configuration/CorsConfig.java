package com.ductm.imagesPost.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
public class CorsConfig {
    //config cors so an angular front-end hosted in http://localhost:4200 can send requests to rest controllers
    //hosted in http://localhost:8080
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOrigin("http://localhost:4200");
        config.setAllowedMethods(Arrays.asList(
                HttpMethod.GET.name(),
                HttpMethod.POST.name(),
                HttpMethod.PUT.name(),
                HttpMethod.DELETE.name(),
                HttpMethod.OPTIONS.name()
        ));
        config.setAllowedHeaders(Arrays.asList(
                HttpHeaders.ACCEPT,
                HttpHeaders.CONTENT_TYPE,
                HttpHeaders.AUTHORIZATION
        ));
        source.registerCorsConfiguration("/**", config);
        CorsFilter filter = new CorsFilter(source);
        return filter;
    }
}
