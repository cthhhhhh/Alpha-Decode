package com.csd.cs203t1.user;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/users")
    public ResponseEntity<?> register(@RequestBody UserDTO.RegisterRequest request) {
        try {
            UserDTO.AuthResponse response = userService.register(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/admin/users")
    public ResponseEntity<?> registerAdmin(@RequestBody UserDTO.RegisterRequest request) {
        try {
            UserDTO.AuthResponse response = userService.registerAdmin(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/contributor-registrations")
    public ResponseEntity<?> registerContributor(@RequestBody UserDTO.RegisterRequest request) {
        try {
            userService.registerContributor(request);
            return ResponseEntity.ok(java.util.Map.of("message",
                "Registration successful. Await admin approval before logging in."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/sessions")
    public ResponseEntity<?> login(@RequestBody UserDTO.LoginRequest request) {
        try {
            UserDTO.AuthResponse response = userService.login(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/users/me")
    public ResponseEntity<?> getCurrentUser() {
        try {
            UserDTO.AuthResponse response = userService.getMe();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Not authenticated");
        }
    }

    @PostMapping("/contributor-requests")
    public ResponseEntity<?> requestContributor() {
        try {
            UserDTO.AuthResponse response = userService.requestContributorStatus();
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Not authenticated");
        }
    }

    @PostMapping("/user-coins")
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

    @PostMapping("/lesson-progress-updates")
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

    @PatchMapping("/users/me/profile")
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

    @PatchMapping("/users/me/password")
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

    @DeleteMapping("/users/me")
    public ResponseEntity<?> deleteAccount() {
        try {
            userService.deleteCurrentUser();
            return ResponseEntity.ok("Account deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Not authenticated");
        }
    }

    @PostMapping("/password-reset-verifications")
    public ResponseEntity<?> verifyUser(@RequestBody UserDTO.VerifyUserRequest request) {
        if (userService.verifyUserForReset(request)) {
            return ResponseEntity.ok("User verified");
        }
        return ResponseEntity.badRequest().body("Invalid username or email");
    }

    @PostMapping("/password-resets")
    public ResponseEntity<?> resetPassword(@RequestBody UserDTO.ResetPasswordRequest request) {
        try {
            userService.resetPassword(request);
            return ResponseEntity.ok("Password reset successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/session-checks")
    public ResponseEntity<?> ping() {
        return ResponseEntity.ok().build();
    }
}
