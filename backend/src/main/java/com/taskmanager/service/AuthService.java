package com.taskmanager.service;

import com.taskmanager.entity.User;
import com.taskmanager.repository.UserRepository;
import com.taskmanager.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationContext;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final ApplicationContext applicationContext;

    // Resolved lazily via ApplicationContext to break the circular dependency:
    // SecurityConfig → AuthService → AuthenticationManager → SecurityConfig
    private AuthenticationManager getAuthenticationManager() {
        return applicationContext.getBean(AuthenticationManager.class);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .roles(user.getRole().name())
                .build();
    }

    public Map<String, String> login(String username, String password) {
        getAuthenticationManager().authenticate(
                new UsernamePasswordAuthenticationToken(username, password));
        String token = jwtUtil.generateToken(username);
        User user = userRepository.findByUsername(username).orElseThrow();
        return Map.of("token", token, "username", user.getUsername(), "role", user.getRole().name());
    }

    public Map<String, String> register(String username, String email, String password) {
        if (userRepository.existsByUsername(username)) throw new RuntimeException("Username already taken");
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);
        String token = jwtUtil.generateToken(username);
        return Map.of("token", token, "username", username, "role", "USER");
    }
}
