package com.csd.cs203t1.admin;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.csd.cs203t1.common.Role;
import com.csd.cs203t1.user.User;
import com.csd.cs203t1.user.UserRepository;
import com.csd.cs203t1.user.UserService;

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
            "pendingApproval", (Object) user.isPendingApproval(),
            "isOnline", (Object) sessionTracker.isOnline(user.getUsername())
        )).toList());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            User currentUser = userService.getCurrentUser();
            if (currentUser.getId().equals(id)) {
                return ResponseEntity.badRequest().body("You cannot delete yourself");
            }
            userService.deleteUserById(id);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to delete user: " + e.getMessage());
        }
    }

    @PatchMapping("/users/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        if (id == null) return ResponseEntity.badRequest().build();
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        String newRoleStr = payload.get("role");
        if (newRoleStr != null) {
            user.setRole(Role.valueOf(newRoleStr.toUpperCase()));
            if (user.getRole() != Role.CONTRIBUTOR) {
                user.setPendingApproval(false);
            }
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

    @PostMapping("/users/{id}/approve-contributor")
    public ResponseEntity<?> approveContributor(@PathVariable Long id) {
        User user = userRepository.findById(id).orElseThrow();
        if (!user.isPendingApproval()) {
            return ResponseEntity.badRequest().body(Map.of("error", "User is not pending approval"));
        }
        user.setRole(Role.CONTRIBUTOR);
        user.setPendingApproval(false);
        user.setEnabled(true);
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "User approved as contributor"));
    }

    @PostMapping("/users/{id}/reject-contributor")
    public ResponseEntity<?> rejectContributor(@PathVariable Long id) {
        User user = userRepository.findById(id).orElseThrow();
        if (!user.isPendingApproval()) {
            return ResponseEntity.badRequest().body(Map.of("error", "User is not pending approval"));
        }
        user.setPendingApproval(false);
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Contributor request rejected"));
    }

    @PostMapping("/users/{id}/reset")
    public ResponseEntity<?> resetUserProgress(@PathVariable Long id) {
        userService.resetProgress(id);
        return ResponseEntity.ok(Map.of("message", "Progress reset successfully"));
    }

    @GetMapping("/contributors/pending")
    public ResponseEntity<?> getPendingContributors() {
        return ResponseEntity.ok(userRepository.findByRoleAndPendingApprovalTrue(Role.CONTRIBUTOR)
                .stream().map(user -> Map.of(
                        "id", user.getId(),
                        "username", user.getUsername(),
                        "email", user.getEmail(),
                        "role", user.getRole().name(),
                "enabled", (Object) user.isEnabled(),
                "pendingApproval", (Object) user.isPendingApproval()
                )).toList());
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
