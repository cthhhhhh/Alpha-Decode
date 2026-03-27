package com.csd.cs203t1.admin;

import com.csd.cs203t1.common.Role;
import com.csd.cs203t1.user.UserRepository;
import com.csd.cs203t1.user.UserService;
import com.csd.cs203t1.user.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final SessionTracker sessionTracker;
    private final UserService userService;

    public AdminController(UserRepository userRepository, SessionTracker sessionTracker, UserService userService) {
        this.userRepository = userRepository;
        this.sessionTracker = sessionTracker;
        this.userService = userService;
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getAdminStats() {
        long totalUsers = userRepository.countByRole(Role.USER);
        long contributors = userRepository.countByRole(Role.CONTRIBUTOR);
        return ResponseEntity.ok(Map.of(
            "totalUsers", totalUsers,
            "contributors", contributors,
            "activeSessions", sessionTracker.getActiveCount(),
            "systemHealth", "Excellent",
            "message", "Welcome to the Admin Dashboard!"
        ));
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll().stream().map(user -> Map.of(
            "id", user.getId(),
            "username", user.getUsername(),
            "email", user.getEmail(),
            "role", user.getRole().name(),
            "level", user.getLevel(),
            "coins", user.getCoins(),
            "enabled", (Object) user.isEnabled(),
            "isOnline", (Object) sessionTracker.isOnline(user.getUsername())
        )).toList());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        User currentUser = userService.getCurrentUser();
        if (currentUser.getId().equals(id)) {
            return ResponseEntity.badRequest().body(Map.of("error", "You cannot delete yourself"));
        }
        userService.deleteUserById(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/users/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        User user = userRepository.findById(id).orElseThrow();
        String newRoleStr = payload.get("role");
        if (newRoleStr != null) {
            user.setRole(Role.valueOf(newRoleStr.toUpperCase()));
            userRepository.save(user);
        }
        return ResponseEntity.ok().build();
    }

    @PostMapping("/users/{id}/ban")
    public ResponseEntity<?> banUser(@PathVariable Long id) {
        User currentUser = userService.getCurrentUser();
        if (currentUser.getId().equals(id)) {
            return ResponseEntity.badRequest().body(Map.of("error", "You cannot ban yourself"));
        }
        userService.setUserEnabled(id, false);
        return ResponseEntity.ok(Map.of("message", "User banned successfully"));
    }

    @PostMapping("/users/{id}/unban")
    public ResponseEntity<?> unbanUser(@PathVariable Long id) {
        userService.setUserEnabled(id, true);
        return ResponseEntity.ok(Map.of("message", "User unbanned successfully"));
    }

    @PostMapping("/users/{id}/reset")
    public ResponseEntity<?> resetUserProgress(@PathVariable Long id) {
        userService.resetProgress(id);
        return ResponseEntity.ok(Map.of("message", "Progress reset successfully"));
    }

    @GetMapping("/users/{id}/stats")
    public ResponseEntity<?> getUserStats(@PathVariable Long id) {
        User user = userRepository.findById(id).orElseThrow();
        return ResponseEntity.ok(Map.of(
            "coins", user.getCoins(),
            "level", user.getLevel(),
            "streak", user.getStreak(),
            "lessonsCompleted", user.getMaxUnlockedLessonIndex(),
            "dailyQuizzesTaken", user.getDailyQuizCount(),
            "lastActive", user.getDailyQuizLastDate() != null ? user.getDailyQuizLastDate().toString() : "Never"
        ));
    }
}
