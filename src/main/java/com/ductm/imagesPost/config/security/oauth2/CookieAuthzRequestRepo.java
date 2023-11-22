package com.ductm.imagesPost.config.security.oauth2;

import com.ductm.imagesPost.config.AppProperties;
import com.ductm.imagesPost.service.CookieService;
import com.nimbusds.oauth2.sdk.util.StringUtils;
import lombok.AllArgsConstructor;
import org.springframework.security.oauth2.client.web.AuthorizationRequestRepository;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Component
@AllArgsConstructor
public class CookieAuthzRequestRepo implements AuthorizationRequestRepository<OAuth2AuthorizationRequest> {
    private AppProperties props;
    private CookieService cookieService;

    @Override
    public OAuth2AuthorizationRequest loadAuthorizationRequest(HttpServletRequest request) {
        return cookieService.getCookie(request, props.getCookie().getAuthorizationRequest())
                .map(cookie -> cookieService.deserialize(cookie, OAuth2AuthorizationRequest.class))
                .orElse(null);
    }

    @Override
    public void saveAuthorizationRequest(
            OAuth2AuthorizationRequest authorizationRequest,
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        if (authorizationRequest == null) {
            cookieService.deleteCookie(request, response, props.getCookie().getAuthorizationRequest());
            cookieService.deleteCookie(request, response, props.getCookie().getRedirectUri());
            return;
        }
        cookieService.addCookie(
                response,
                props.getCookie().getAuthorizationRequest(),
                cookieService.serialize(authorizationRequest),
                props.getCookie().getExpiration()
        );
        String redirectUriAfterLogin = request.getParameter(props.getCookie().getRedirectUri());
        if (StringUtils.isNotBlank(redirectUriAfterLogin)) {
            cookieService.addCookie(
                    response,
                    props.getCookie().getRedirectUri(),
                    redirectUriAfterLogin,
                    props.getCookie().getExpiration()
            );
        }
    }

    @Override
    public OAuth2AuthorizationRequest removeAuthorizationRequest(HttpServletRequest request) {
        return this.loadAuthorizationRequest(request);
    }

    public void removeAuthorizationRequestCookies(HttpServletRequest request, HttpServletResponse response) {
        cookieService.deleteCookie(request, response, props.getCookie().getAuthorizationRequest());
        cookieService.deleteCookie(request, response, props.getCookie().getRedirectUri());
    }
}
