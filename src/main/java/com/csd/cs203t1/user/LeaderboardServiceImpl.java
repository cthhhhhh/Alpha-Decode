package com.csd.cs203t1.user;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.csd.cs203t1.common.Role;

@Service
public class LeaderboardServiceImpl implements LeaderboardService {

    private final UserRepository userRepository;
    private final UserService userService;

    public LeaderboardServiceImpl(UserRepository userRepository, UserService userService) {
        this.userRepository = userRepository;
        this.userService = userService;
    }

    @Override
    public List<LeaderboardEntryDTO> getLeaderboard(int limit, String period, String sort) {
        Pageable pageable = PageRequest.of(0, limit);

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
                topUsers = userRepository.findAllByRoleNotOrderByTotalCoinsCollectedDescLevelDesc(Role.ADMIN, pageable).getContent();
            }
        }

        AtomicInteger rank = new AtomicInteger(1);
        return topUsers.stream()
                .map(u -> new LeaderboardEntryDTO(
                        rank.getAndIncrement(),
                        u.getUsername(),
                        u.getLevel(),
                        "weekly".equals(period) ? u.getWeeklyCoinsCollected() : u.getTotalCoinsCollected(),
                        u.getStreak()))
                .collect(Collectors.toList());
    }

    @Override
    public Map<String, Object> getMyRank(String period, String sort) {
        User currentUser = userService.getCurrentUserReadOnly();

        if (currentUser.getRole() == Role.ADMIN) {
            Map<String, Object> result = new HashMap<>();
            result.put("rank", 0);
            result.put("entry", null);
            return result;
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
        return result;
    }
}
