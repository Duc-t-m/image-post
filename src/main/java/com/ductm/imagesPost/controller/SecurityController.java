package com.ductm.imagesPost.controller;

import com.ductm.imagesPost.configuration.JwtService;
import com.ductm.imagesPost.dto.UserLoginDTO;
import com.ductm.imagesPost.dto.UserSignUpDTO;
import com.ductm.imagesPost.entity.User;
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
            User user = new User();
            user.setUsername(userSignupDTO.getUsername());
            user.setPassword(passwordEncoder.encode(userSignupDTO.getPassword()));
            user.setEmail(userSignupDTO.getEmail());
            user.setRole("USER");
            return ResponseEntity.ok(jwtService.generateToken(userRepository.save(user)));
        }
    }
}
