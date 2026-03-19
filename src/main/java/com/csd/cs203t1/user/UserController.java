package com.csd.cs203t1.user;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserDTO.RegisterRequest request) {
        try {
            UserDTO.AuthResponse response = userService.register(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserDTO.LoginRequest request) {
        try {
            UserDTO.AuthResponse response = userService.login(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        try {
            User user = userService.getCurrentUser();
            return ResponseEntity.ok(new UserDTO.AuthResponse(null, user.getRole().name(), user.getUsername(), user.getLevel(), user.getXp(), user.getMaxUnlockedLessonIndex()));
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Not authenticated");
        }
    }

    @PostMapping("/xp")
    public ResponseEntity<?> addXp(@RequestBody UserDTO.XpUpdateRequest request) {
        try {
            UserDTO.AuthResponse response = userService.updateXp(request.getXpToAdd());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Not authenticated");
        }
    }

    @PostMapping("/lesson-progress")
    public ResponseEntity<?> updateLessonProgress(@RequestBody UserDTO.LessonProgressUpdateRequest request) {
        try {
            UserDTO.AuthResponse response = userService.updateLessonProgress(request.getMaxUnlockedLessonIndex());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Not authenticated");
        }
    }
}
