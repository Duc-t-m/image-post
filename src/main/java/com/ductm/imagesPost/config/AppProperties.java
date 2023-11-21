package com.ductm.imagesPost.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@ConfigurationProperties(prefix = "app")
public class AppProperties {
    private final Cors cors = new Cors();
    private final Img img = new Img();
    private final Jwt jwt = new Jwt();
    private final OAuth2 oauth2 = new OAuth2();
    private final Cookie cookie = new Cookie();

    @Getter
    @Setter
    public static final class Cors {
        private List<String> allowedOrigins = new ArrayList<>();
    }

    @Getter
    @Setter
    public static final class Img {
        private String path;
    }

    @Getter
    @Setter
    public static class Jwt {
        private String secret;
        private long expiration;
    }

    @Getter
    @Setter
    public static final class OAuth2 {
        private List<String> authorizedRedirectUris = new ArrayList<>();
    }

    @Getter
    @Setter
    public static final class Cookie {
        private int expiration;
        private String redirectUri;
        private String authorizationRequest;
    }
}
