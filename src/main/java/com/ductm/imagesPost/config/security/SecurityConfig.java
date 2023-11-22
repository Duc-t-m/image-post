package com.ductm.imagesPost.config.security;

import com.ductm.imagesPost.config.security.oauth2.CookieAuthzRequestRepo;
import com.ductm.imagesPost.config.security.oauth2.CustomOAuth2UserService;
import com.ductm.imagesPost.config.security.oauth2.OAuth2FailureHandler;
import com.ductm.imagesPost.config.security.oauth2.OAuth2SuccessHandler;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.servlet.http.HttpServletResponse;

@EnableWebSecurity
@AllArgsConstructor
@Slf4j
public class SecurityConfig {
    private CustomOAuth2UserService oAuth2UserService;
    private OAuth2SuccessHandler successHandler;
    private OAuth2FailureHandler failureHandler;
    private JwtFilter jwtFilter;
    private CookieAuthzRequestRepo cookieAuthzRequestRepo;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        // @formatter:off
        http
            .cors()
                .and()
            .csrf()
                .disable()
            .authorizeRequests()
                .antMatchers("/login", "/sign-up", "/check/**").permitAll()
                .antMatchers(HttpMethod.OPTIONS).permitAll()
                .anyRequest().authenticated()
                .and()
            .exceptionHandling()
                .authenticationEntryPoint((req, res, err) -> {
                    log.error("Responding with unauthorized error. Message - {}", err.getMessage());
                    res.sendError(HttpServletResponse.SC_UNAUTHORIZED, err.getLocalizedMessage());
                })
                .and()
            .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
            .oauth2Login()
                .authorizationEndpoint()
                    .baseUri("/oauth2/authorize")
                .authorizationRequestRepository(cookieAuthzRequestRepo)
                    .and()
                .redirectionEndpoint()
                    .baseUri("/oauth2/callback/*")
                    .and()
                .userInfoEndpoint()
                    .userService(oAuth2UserService)
                    .and()
                .successHandler(successHandler)
                .failureHandler(failureHandler)
                .and()
            .logout()
            ;
        // @formatter:on
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
