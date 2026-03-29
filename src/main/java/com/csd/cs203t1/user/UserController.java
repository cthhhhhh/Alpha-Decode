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

    @PostMapping("/register-admin")
    public ResponseEntity<?> registerAdmin(@RequestBody UserDTO.RegisterRequest request) {
        try {
            UserDTO.AuthResponse response = userService.registerAdmin(request);
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
            UserDTO.AuthResponse response = userService.getMe();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Not authenticated");
        }
    }

    @PostMapping("/coins")
    public ResponseEntity<?> addCoins(@RequestBody UserDTO.CoinUpdateRequest request) {
        try {
            if (request.getCoinsToAdd() < 0) throw new IllegalArgumentException("Coins to add must be non-negative");
            UserDTO.AuthResponse response = userService.updateCoins(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Internal server error");
        }
    }

    @PostMapping("/lesson-progress")
    public ResponseEntity<?> updateLessonProgress(@RequestBody UserDTO.LessonProgressUpdateRequest request) {
        try {
            UserDTO.AuthResponse response = userService.updateLessonProgress(request.getMaxUnlockedLessonIndex());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Internal server error");
        }
    }

    @PatchMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody UserDTO.UpdateProfileRequest request) {
        try {
            UserDTO.AuthResponse response = userService.updateProfile(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Not authenticated");
        }
    }

    @PatchMapping("/password")
    public ResponseEntity<?> changePassword(@RequestBody UserDTO.ChangePasswordRequest request) {
        try {
            userService.changePassword(request);
            return ResponseEntity.ok("Password updated successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Not authenticated");
        }
    }

    @DeleteMapping("/me")
    public ResponseEntity<?> deleteAccount() {
        try {
            userService.deleteCurrentUser();
            return ResponseEntity.ok("Account deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Not authenticated");
        }
    }

    @PostMapping("/verify-user")
    public ResponseEntity<?> verifyUser(@RequestBody UserDTO.VerifyUserRequest request) {
        if (userService.verifyUserForReset(request)) {
            return ResponseEntity.ok("User verified");
        }
        return ResponseEntity.badRequest().body("Invalid username or email");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody UserDTO.ResetPasswordRequest request) {
        try {
            userService.resetPassword(request);
            return ResponseEntity.ok("Password reset successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/ping")
    public ResponseEntity<?> ping() {
        return ResponseEntity.ok().build();
    }
}
