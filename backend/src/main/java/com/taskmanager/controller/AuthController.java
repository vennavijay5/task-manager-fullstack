package com.taskmanager.controller;

import com.taskmanager.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Login and Registration endpoints")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Login with username and password")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> req) {
        return ResponseEntity.ok(authService.login(req.get("username"), req.get("password")));
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new user")
    public ResponseEntity<Map<String, String>> register(@RequestBody Map<String, String> req) {
        return ResponseEntity.ok(authService.register(
                req.get("username"), req.get("email"), req.get("password")));
    }
}
