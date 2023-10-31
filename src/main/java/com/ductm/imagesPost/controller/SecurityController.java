package com.ductm.imagesPost.controller;

import com.ductm.imagesPost.configuration.JwtService;
import com.ductm.imagesPost.dto.UserLoginDTO;
import com.ductm.imagesPost.dto.UserSignUpDTO;
import com.ductm.imagesPost.entity.Account;
import com.ductm.imagesPost.entity.Profile;
import com.ductm.imagesPost.mapper.UserAccountMapper;
import com.ductm.imagesPost.repository.AccountRepository;
import com.ductm.imagesPost.repository.ProfileRepository;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.function.Function;

@RestController
@RequestMapping("")
@AllArgsConstructor
public class SecurityController {

    private JwtService jwtService;
    private UserDetailsService userDetailsService;
    private PasswordEncoder passwordEncoder;
    private AccountRepository accountRepository;
    private ProfileRepository profileRepository;
    private UserAccountMapper userAccountMapper;
    private final Logger logger = LoggerFactory.getLogger(SecurityController.class);

    @PostMapping("/login")
    public ResponseEntity<String> authenticateUser(@RequestBody UserLoginDTO userLoginDTO) {
        try {
            UserDetails user = userDetailsService.loadUserByUsername(userLoginDTO.getUsername());
            if (!passwordEncoder.matches(userLoginDTO.getPassword(), user.getPassword())) {
                return ResponseEntity.badRequest().body("Wrong password!");
            }
            return ResponseEntity.ok(jwtService.generateToken(user));
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.badRequest().body("Username not found!");
        }
    }

    @PostMapping("/sign-up")
    public ResponseEntity<String> registerUser(@RequestBody UserSignUpDTO userSignupDTO) {
        logger.info("Registering user: " + userSignupDTO.getUsername());
        Account account = accountRepository.save(userAccountMapper.userSignUpToAccount(userSignupDTO));
        Profile profile = userAccountMapper.userSignUpToProfile(userSignupDTO);
        if (profile.getPhone() != null || profile.getDob() != null || profile.getGender() != null) {
            profile.setAccount(account);
            profileRepository.save(profile);
        }
        return ResponseEntity.ok(jwtService.generateToken(userAccountMapper.toUser(account)));
    }

    @PostMapping("/check/{field}")
    public ResponseEntity<Boolean> checkFieldExists(@PathVariable String field, @RequestBody String value) {
        Function<String, Boolean> checkFunc;
        switch (field) {
            case "username":
                checkFunc = accountRepository::existsByUsername;
                break;
            case "email":
                checkFunc = accountRepository::existsByEmail;
                break;
            case "phone":
                checkFunc = profileRepository::existsByPhone;
                break;
            default:
                return ResponseEntity.badRequest().body(false);
        }
        return ResponseEntity.ok(checkFunc.apply(value));
    }
}
