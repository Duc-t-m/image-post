//package com.ductm.imagesPost.configuration;
//
//import lombok.AllArgsConstructor;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.context.annotation.Primary;
//import org.springframework.security.authentication.AuthenticationProvider;
//import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
//import org.springframework.security.core.userdetails.User;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.security.provisioning.InMemoryUserDetailsManager;
//
//@Configuration
//@AllArgsConstructor
//public class AuthenticationProviderConfig {
//
//    private final UserDetailsService userDetailsService;
//    private final PasswordEncoder passwordEncoder;
//
//    @Bean
//    AuthenticationProvider DatabaseAuthenticationProvider() {
//        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
//        provider.setUserDetailsService(userDetailsService);
//        provider.setPasswordEncoder(passwordEncoder);
//        return provider;
//    }
//
//    @Bean
//    @Primary
//    public AuthenticationProvider inMemoryAuthenticationProvider() {
//        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
//        InMemoryUserDetailsManager manager = new InMemoryUserDetailsManager(
//                User.withUsername("user1234").password(passwordEncoder.encode("@Password1")).roles("USER").build(),
//                User.withUsername("admin123").password(passwordEncoder.encode("@Password1")).roles("ADMIN").build()
//        );
//        provider.setUserDetailsService(manager);
//        provider.setPasswordEncoder(passwordEncoder);
//        return provider;
//    }
//}
