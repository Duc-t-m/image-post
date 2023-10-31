package com.ductm.imagesPost.configuration;

import com.ductm.imagesPost.entity.Account;
import com.ductm.imagesPost.mapper.UserAccountMapper;
import com.ductm.imagesPost.repository.AccountRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    private AccountRepository accountRepository;
    private UserAccountMapper userAccountMapper;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Account account = this.accountRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found!"));
        return userAccountMapper.toUser(account);
    }
}
