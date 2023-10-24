package com.ductm.imagesPost.controller;

import com.ductm.imagesPost.configuration.JwtService;
import com.ductm.imagesPost.dto.UserDTO;
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
    private final Logger logger = LoggerFactory.getLogger(SecurityController.class);

    @PostMapping("/login")
    public ResponseEntity<String> authenticateUser(@RequestBody UserDTO userDTO) {
        try {
            UserDetails user = this.userDetailsService.loadUserByUsername(userDTO.getUsername());
            if (!passwordEncoder.matches(userDTO.getPassword(), user.getPassword())) {
                return ResponseEntity.badRequest().body("Wrong password!");
            }
            return ResponseEntity.ok(jwtService.generateToken(user));
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.badRequest().body("Username not found!");
        }
    }
}
