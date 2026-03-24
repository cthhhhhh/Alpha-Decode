package com.csd.cs203t1.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {

    private final UserRepository userRepository;

    @Value("${leaderboard.default-limit:10}")
    private int defaultLimit;

    public LeaderboardController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<LeaderboardEntryDTO>> getLeaderboard(
            @RequestParam(required = false) Integer limit) {
        int count = (limit != null && limit > 0) ? limit : defaultLimit;
        Pageable pageable = PageRequest.of(0, count);
        List<User> topUsers = userRepository.findAllByOrderByXpDescLevelDesc(pageable).getContent();

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
