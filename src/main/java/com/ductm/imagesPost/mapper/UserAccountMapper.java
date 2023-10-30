package com.ductm.imagesPost.mapper;

import com.ductm.imagesPost.dto.UserSignUpDTO;
import com.ductm.imagesPost.entity.Account;
import com.ductm.imagesPost.entity.Profile;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;
import java.util.Collections;

@Mapper(componentModel = "spring")
public abstract class UserAccountMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "email", ignore = true)
    @Mapping(target = "role", source = "authorities")
    public abstract Account userToAccount(User user);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "role", constant = "USER")
    public abstract Account userSignUpToAccount(UserSignUpDTO userSignUpDTO);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "account", ignore = true)
    public abstract Profile userSignUpToProfile(UserSignUpDTO userSignUpDTO);

    protected String toRole(Collection<GrantedAuthority> authorities) {
        return authorities.iterator().next().getAuthority();
    }

    public User toUser(Account account) {
        return new User(
                account.getUsername(),
                account.getPassword(),
                toGrantedAuthorities(account.getRole())
        );
    }

    protected Collection<GrantedAuthority> toGrantedAuthorities(String role) {
        return Collections.singleton(new SimpleGrantedAuthority(role));
    }
}
