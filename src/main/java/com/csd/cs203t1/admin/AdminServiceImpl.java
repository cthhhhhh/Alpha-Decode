package com.csd.cs203t1.admin;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.csd.cs203t1.common.ResourceNotFoundException;
import com.csd.cs203t1.common.Role;
import com.csd.cs203t1.user.User;
import com.csd.cs203t1.user.UserRepository;

@Service
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final SessionTracker sessionTracker;

    public AdminServiceImpl(UserRepository userRepository, SessionTracker sessionTracker) {
        this.userRepository = userRepository;
        this.sessionTracker = sessionTracker;
    }

    @Override
    public Map<String, Object> getAdminStats() {
        long totalUsers = userRepository.countByRole(Role.USER);
        long contributors = userRepository.countByRole(Role.CONTRIBUTOR);
        return Map.of(
                "totalUsers", totalUsers,
                "contributors", contributors,
                "activeSessions", sessionTracker.getActiveCount(),
                "systemHealth", "Excellent",
                "message", "Welcome to the Admin Dashboard!"
        );
    }

    @Override
    public List<Map<String, Object>> getAllUsers() {
        return userRepository.findAll().stream().map(user -> Map.<String, Object>of(
                "id", user.getId(),
                "username", user.getUsername(),
                "email", user.getEmail(),
                "role", user.getRole().name(),
                "level", user.getLevel(),
                "coins", user.getCoins(),
                "enabled", user.isEnabled(),
                "pendingApproval", user.isPendingApproval(),
                "isOnline", sessionTracker.isOnline(user.getUsername())
        )).toList();
    }

    @Override
    public void updateUserRole(Long id, String newRoleStr) {
        User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (newRoleStr != null) {
            user.setRole(Role.valueOf(newRoleStr.toUpperCase()));
            if (user.getRole() != Role.CONTRIBUTOR) {
                user.setPendingApproval(false);
            }
            userRepository.save(user);
        }
    }

    @Override
    public void approveContributor(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (!user.isPendingApproval()) {
            throw new IllegalArgumentException("User is not pending approval");
        }
        user.setRole(Role.CONTRIBUTOR);
        user.setPendingApproval(false);
        user.setEnabled(true);
        userRepository.save(user);
    }

    @Override
    public void rejectContributor(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (!user.isPendingApproval()) {
            throw new IllegalArgumentException("User is not pending approval");
        }
        user.setPendingApproval(false);
        userRepository.save(user);
    }

    @Override
    public List<Map<String, Object>> getPendingContributors() {
        return userRepository.findByRoleAndPendingApprovalTrue(Role.CONTRIBUTOR)
                .stream().map(user -> Map.<String, Object>of(
                        "id", user.getId(),
                        "username", user.getUsername(),
                        "email", user.getEmail(),
                        "role", user.getRole().name(),
                        "enabled", user.isEnabled(),
                        "pendingApproval", user.isPendingApproval()
                )).toList();
    }

    @Override
    public Map<String, Object> getUserStats(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return Map.of(
                "coins", user.getCoins(),
                "level", user.getLevel(),
                "streak", user.getStreak(),
                "lessonsCompleted", user.getMaxUnlockedLessonIndex(),
                "dailyQuizzesTaken", user.getDailyQuizCount(),
                "lastActive", user.getDailyQuizLastDate() != null ? user.getDailyQuizLastDate().toString() : "Never"
        );
    }
}
