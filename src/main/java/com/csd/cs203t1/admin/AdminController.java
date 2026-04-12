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

import com.csd.cs203t1.user.User;
import com.csd.cs203t1.user.UserService;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final UserService userService;

    public AdminController(AdminService adminService, UserService userService) {
        this.adminService = adminService;
        this.userService = userService;
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getAdminStats() {
        return ResponseEntity.ok(adminService.getAdminStats());
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            User currentUser = userService.getCurrentUserReadOnly();
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
        String newRoleStr = payload.get("role");
        adminService.updateUserRole(id, newRoleStr);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/users/{id}/ban")
    public ResponseEntity<?> banUser(@PathVariable Long id) {
        User currentUser = userService.getCurrentUserReadOnly();
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
        try {
            adminService.approveContributor(id);
            return ResponseEntity.ok(Map.of("message", "User approved as contributor"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/users/{id}/reject-contributor")
    public ResponseEntity<?> rejectContributor(@PathVariable Long id) {
        try {
            adminService.rejectContributor(id);
            return ResponseEntity.ok(Map.of("message", "Contributor request rejected"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/users/{id}/reset")
    public ResponseEntity<?> resetUserProgress(@PathVariable Long id) {
        userService.resetProgress(id);
        return ResponseEntity.ok(Map.of("message", "Progress reset successfully"));
    }

    @GetMapping("/contributors/pending")
    public ResponseEntity<?> getPendingContributors() {
        return ResponseEntity.ok(adminService.getPendingContributors());
    }

    @GetMapping("/users/{id}/stats")
    public ResponseEntity<?> getUserStats(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getUserStats(id));
    }
}
