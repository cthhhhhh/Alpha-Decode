package com.csd.cs203t1.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
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
            @RequestParam(required = false, defaultValue = "xp") String sort) {

        int count = (limit != null && limit > 0) ? limit : defaultLimit;
        Pageable pageable = PageRequest.of(0, count);

        List<User> topUsers;
        if ("weekly".equals(period)) {
            LocalDate since = LocalDate.now().minusDays(7);
            if ("streak".equals(sort)) {
                topUsers = userRepository
                        .findByDailyQuizLastDateGreaterThanEqualOrderByXpDescLevelDesc(since, pageable)
                        .getContent()
                        .stream()
                        .sorted((a, b) -> b.getStreak() != a.getStreak()
                                ? Integer.compare(b.getStreak(), a.getStreak())
                                : Integer.compare(b.getXp(), a.getXp()))
                        .collect(Collectors.toList());
            } else {
                topUsers = userRepository
                        .findByDailyQuizLastDateGreaterThanEqualOrderByXpDescLevelDesc(since, pageable)
                        .getContent();
            }
        } else {
            if ("streak".equals(sort)) {
                topUsers = userRepository.findAllByOrderByStreakDescXpDesc(pageable).getContent();
            } else {
                topUsers = userRepository.findAllByOrderByXpDescLevelDesc(pageable).getContent();
            }
        }

        AtomicInteger rank = new AtomicInteger(1);
        List<LeaderboardEntryDTO> entries = topUsers.stream()
                .map(u -> new LeaderboardEntryDTO(
                        rank.getAndIncrement(),
                        u.getUsername(),
                        u.getLevel(),
                        u.getXp(),
                        u.getStreak()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(entries);
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getMyRank(@RequestParam(defaultValue = "xp") String sort) {
        User currentUser = userService.getCurrentUser();
        long rank;
        if ("streak".equals(sort)) {
            long streakGreater = userRepository.countByStreakGreaterThan(currentUser.getStreak());
            long sameStreakBetterXp = userRepository.countByStreakAndXpGreaterThan(currentUser.getStreak(), currentUser.getXp());
            rank = streakGreater + sameStreakBetterXp + 1;
        } else {
            rank = userRepository.countByXpGreaterThan(currentUser.getXp()) + 1;
        }

        Map<String, Object> result = new HashMap<>();
        result.put("rank", rank);
        result.put("entry", new LeaderboardEntryDTO(
                (int) rank,
                currentUser.getUsername(),
                currentUser.getLevel(),
                currentUser.getXp(),
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
        private int xp;
        private int streak;
    }
}
