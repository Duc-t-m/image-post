package com.ductm.imagesPost.controller;

import com.ductm.imagesPost.dto.LoginDTO;
import com.ductm.imagesPost.dto.SignUpDTO;
import com.ductm.imagesPost.entity.AuthProvider;
import com.ductm.imagesPost.entity.User;
import com.ductm.imagesPost.repository.ProfileRepository;
import com.ductm.imagesPost.repository.UserRepository;
import com.ductm.imagesPost.service.JwtService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.net.URI;
import java.util.function.Function;

@RestController
@RequestMapping("")
@AllArgsConstructor
@Slf4j
public class SecurityController {
    private AuthenticationManager authManager;
    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private JwtService jwtService;
    private ProfileRepository profileRepository;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginDTO loginDTO) {
        Authentication authentication = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDTO.getEmail(),
                        loginDTO.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = jwtService.createToken(authentication);
        return ResponseEntity.ok(token);
    }

    @PostMapping("/sign-up")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignUpDTO signUpDTO) {
        if (userRepository.existsByEmail(signUpDTO.getEmail())) {
            return ResponseEntity.badRequest().body("Email address already in use.");
        }

        User user = new User();
        user.setEmail(signUpDTO.getEmail());
        user.setName(signUpDTO.getName());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setProvider(AuthProvider.local);

        User result = userRepository.save(user);

        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath().path("/user/me")
                .buildAndExpand(result.getId()).toUri();

        return ResponseEntity.created(location).body("User registered successfully@");
    }

    @PostMapping("/check/{field}")
    public ResponseEntity<Boolean> checkFieldExists(@PathVariable String field, @RequestBody String value) {
        Function<String, Boolean> checkFunc;
        switch (field) {
            case "email":
                checkFunc = userRepository::existsByEmail;
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
