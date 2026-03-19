package com.csd.cs203t1.admin;

import com.csd.cs203t1.common.Role;
import com.csd.cs203t1.user.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final SessionTracker sessionTracker;

    public AdminController(UserRepository userRepository, SessionTracker sessionTracker) {
        this.userRepository = userRepository;
        this.sessionTracker = sessionTracker;
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getAdminStats() {
        long totalUsers = userRepository.countByRole(Role.USER);
        
        return ResponseEntity.ok(Map.of(
            "totalUsers", totalUsers,
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
            "xp", user.getXp()
        )).toList());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@org.springframework.web.bind.annotation.PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @org.springframework.web.bind.annotation.PatchMapping("/users/{id}/role")
    public ResponseEntity<?> updateUserRole(@org.springframework.web.bind.annotation.PathVariable Long id, @org.springframework.web.bind.annotation.RequestBody Map<String, String> payload) {
        com.csd.cs203t1.user.User user = userRepository.findById(id).orElseThrow();
        String newRoleStr = payload.get("role");
        if (newRoleStr != null) {
            user.setRole(Role.valueOf(newRoleStr.toUpperCase()));
            userRepository.save(user);
        }
        return ResponseEntity.ok().build();
    }
}
