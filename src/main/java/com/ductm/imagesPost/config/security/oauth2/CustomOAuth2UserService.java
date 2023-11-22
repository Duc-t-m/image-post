package com.ductm.imagesPost.config.security.oauth2;

import com.ductm.imagesPost.config.security.UserPrincipal;
import com.ductm.imagesPost.config.security.oauth2.user.OAuth2UserInfo;
import com.ductm.imagesPost.config.security.oauth2.user.OAuth2UserInfoFactory;
import com.ductm.imagesPost.entity.AuthProvider;
import com.ductm.imagesPost.entity.User;
import com.ductm.imagesPost.exception.OAuth2AuthenticationProcessingException;
import com.ductm.imagesPost.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Optional;

@Service
@AllArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    private UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest oAuth2UserRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(oAuth2UserRequest);
        try {
            return processOAuth2User(oAuth2UserRequest, oAuth2User);
        } catch (AuthenticationException ex) {
            throw ex;
        } catch (Exception ex) {
            // Throwing an instance of AuthenticationException will trigger the OAuth2AuthenticationFailureHandler
            throw new InternalAuthenticationServiceException(ex.getMessage(), ex.getCause());
        }
    }

    private OAuth2User processOAuth2User(OAuth2UserRequest request, OAuth2User oAuth2User) {
        OAuth2UserInfo userInfo = OAuth2UserInfoFactory.getOAuth2UserInfo(
                request.getClientRegistration().getRegistrationId(),
                oAuth2User.getAttributes()
        );
        if (!StringUtils.hasText(userInfo.getEmail())) {
            throw new OAuth2AuthenticationProcessingException("Email not found from OAuth2 provider");
        }
        Optional<User> userOptional = userRepository.findByEmail(userInfo.getEmail());
        User user;
        if (userOptional.isPresent()) {
            user = userOptional.get();
            if (!user.getProvider().equals(AuthProvider.valueOf(request.getClientRegistration().getRegistrationId()))) {
                throw new OAuth2AuthenticationProcessingException("Looks like you're signed up with " +
                        user.getProvider() + " account. Please use your " + user.getProvider() +
                        " account to login.");
            }
            user = updateExistingUser(user, userInfo);
        } else {
            user = registerNewUser(request, userInfo);
        }
        return UserPrincipal.create(user, oAuth2User.getAttributes());
    }

    private User registerNewUser(OAuth2UserRequest request, OAuth2UserInfo info) {
        User user = new User();

        user.setProvider(AuthProvider.valueOf(request.getClientRegistration().getRegistrationId()));
        user.setProviderId(info.getId());
        user.setName(info.getName());
        user.setEmail(info.getEmail());
        user.setAvatarUrl(info.getAvatarUrl());
        user.setEmailVerified(true);
        return userRepository.save(user);
    }

    private User updateExistingUser(User user, OAuth2UserInfo info) {
        user.setName(info.getName());
        user.setAvatarUrl(info.getAvatarUrl());
        return userRepository.save(user);
    }
}
