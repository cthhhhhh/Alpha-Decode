package com.csd.cs203t1.user;

import com.csd.cs203t1.common.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {

    private final UserRepository userRepository;
    private final UserService userService;

    @Value("${leaderboard.default-limit:10}")
    private int defaultLimit;

    public LeaderboardController(UserRepository userRepository, UserService userService) {
        this.userRepository = userRepository;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<LeaderboardEntryDTO>> getLeaderboard(
            @RequestParam(required = false) Integer limit,
            @RequestParam(required = false, defaultValue = "allTime") String period,
            @RequestParam(required = false, defaultValue = "coins") String sort) {

        int count = (limit != null && limit > 0) ? limit : defaultLimit;
        Pageable pageable = PageRequest.of(0, count);

        List<User> topUsers;
        if ("weekly".equals(period)) {
            if ("streak".equals(sort)) {
                topUsers = userRepository
                        .findAllByRoleNotOrderByWeeklyCoinsCollectedDescLevelDesc(Role.ADMIN, pageable)
                        .getContent()
                        .stream()
                        .sorted((a, b) -> b.getStreak() != a.getStreak()
                                ? Integer.compare(b.getStreak(), a.getStreak())
                                : Integer.compare(b.getWeeklyCoinsCollected(), a.getWeeklyCoinsCollected()))
                        .collect(Collectors.toList());
            } else {
                topUsers = userRepository
                        .findAllByRoleNotOrderByWeeklyCoinsCollectedDescLevelDesc(Role.ADMIN, pageable)
                        .getContent();
            }
        } else {
            if ("streak".equals(sort)) {
                topUsers = userRepository.findAllByRoleNotOrderByStreakDescTotalCoinsCollectedDesc(Role.ADMIN, pageable).getContent();
            } else {
                // Default: Total coins collected
                topUsers = userRepository.findAllByRoleNotOrderByTotalCoinsCollectedDescLevelDesc(Role.ADMIN, pageable).getContent();
            }
        }

        AtomicInteger rank = new AtomicInteger(1);
        List<LeaderboardEntryDTO> entries = topUsers.stream()
                .map(u -> new LeaderboardEntryDTO(
                        rank.getAndIncrement(),
                        u.getUsername(),
                        u.getLevel(),
                        "weekly".equals(period) ? u.getWeeklyCoinsCollected() : u.getTotalCoinsCollected(),
                        u.getStreak()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(entries);
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getMyRank(
            @RequestParam(required = false, defaultValue = "allTime") String period,
            @RequestParam(required = false, defaultValue = "coins") String sort) {
        User currentUser = userService.getCurrentUser();
        
        if (currentUser.getRole() == Role.ADMIN) {
             Map<String, Object> result = new HashMap<>();
             result.put("rank", 0);
             result.put("entry", null);
             return ResponseEntity.ok(result);
        }

        long rank;
        if ("weekly".equals(period)) {
            if ("streak".equals(sort)) {
                long streakGreater = userRepository.countByRoleNotAndStreakGreaterThan(Role.ADMIN, currentUser.getStreak());
                long sameStreakBetterCoins = userRepository.countByRoleNotAndStreakAndWeeklyCoinsCollectedGreaterThan(Role.ADMIN, currentUser.getStreak(), currentUser.getWeeklyCoinsCollected());
                rank = streakGreater + sameStreakBetterCoins + 1;
            } else {
                long coinsGreater = userRepository.countByRoleNotAndWeeklyCoinsCollectedGreaterThan(Role.ADMIN, currentUser.getWeeklyCoinsCollected());
                rank = coinsGreater + 1;
            }
        } else {
            if ("streak".equals(sort)) {
                long streakGreater = userRepository.countByRoleNotAndStreakGreaterThan(Role.ADMIN, currentUser.getStreak());
                long sameStreakBetterCoins = userRepository.countByRoleNotAndStreakAndTotalCoinsCollectedGreaterThan(Role.ADMIN, currentUser.getStreak(), currentUser.getTotalCoinsCollected());
                rank = streakGreater + sameStreakBetterCoins + 1;
            } else {
                long coinsGreater = userRepository.countByRoleNotAndTotalCoinsCollectedGreaterThan(Role.ADMIN, currentUser.getTotalCoinsCollected());
                rank = coinsGreater + 1;
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("rank", rank);
        result.put("entry", new LeaderboardEntryDTO(
                (int) rank,
                currentUser.getUsername(),
                currentUser.getLevel(),
                "weekly".equals(period) ? currentUser.getWeeklyCoinsCollected() : currentUser.getTotalCoinsCollected(),
                currentUser.getStreak()));
        return ResponseEntity.ok(result);
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class LeaderboardEntryDTO {
        private int rank;
        private String username;
        private int level;
        private int coins;
        private int streak;
    }
}
