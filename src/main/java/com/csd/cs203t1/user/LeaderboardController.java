package com.csd.cs203t1.user;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    @Value("${leaderboard.default-limit:10}")
    private int defaultLimit;

    public LeaderboardController(LeaderboardService leaderboardService) {
        this.leaderboardService = leaderboardService;
    }

    @GetMapping
    public ResponseEntity<List<LeaderboardEntryDTO>> getLeaderboard(
            @RequestParam(required = false) Integer limit,
            @RequestParam(required = false, defaultValue = "allTime") String period,
            @RequestParam(required = false, defaultValue = "coins") String sort) {

        int count = (limit != null && limit > 0) ? limit : defaultLimit;
        return ResponseEntity.ok(leaderboardService.getLeaderboard(count, period, sort));
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getMyRank(
            @RequestParam(required = false, defaultValue = "allTime") String period,
            @RequestParam(required = false, defaultValue = "coins") String sort) {
        return ResponseEntity.ok(leaderboardService.getMyRank(period, sort));
    }
}
