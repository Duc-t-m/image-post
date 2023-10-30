package com.ductm.imagesPost.controller;

import com.ductm.imagesPost.configuration.JwtService;
import com.ductm.imagesPost.dto.UserLoginDTO;
import com.ductm.imagesPost.dto.UserSignUpDTO;
import com.ductm.imagesPost.entity.Account;
import com.ductm.imagesPost.entity.Profile;
import com.ductm.imagesPost.mapper.UserAccountMapper;
import com.ductm.imagesPost.repository.ProfileRepository;
import com.ductm.imagesPost.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("")
@AllArgsConstructor
public class SecurityController {

    private JwtService jwtService;
    private UserDetailsService userDetailsService;
    private PasswordEncoder passwordEncoder;
    private UserRepository userRepository;
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
        try {
            userDetailsService.loadUserByUsername(userSignupDTO.getUsername());
            return ResponseEntity.badRequest().body("Username already exists!");
        } catch (UsernameNotFoundException e) {
            logger.info("Registering user: " + userSignupDTO.getUsername());
            Account account = userRepository.save(userAccountMapper.userSignUpToAccount(userSignupDTO));
            Profile profile = userAccountMapper.userSignUpToProfile(userSignupDTO);
            if (profile.getPhone() != null || profile.getDob() != null || profile.getGender() != null) {
                profile.setAccount(account);
                profileRepository.save(profile);
            }
            return ResponseEntity.ok(jwtService.generateToken(userAccountMapper.toUser(account)));
        }
    }
}
