package com.csd.cs203t1.user;

import com.csd.cs203t1.common.Role;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("LeaderboardServiceImpl Unit Tests")
class LeaderboardServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserService userService;

    @InjectMocks
    private LeaderboardServiceImpl leaderboardService;

    @Test
    @DisplayName("getLeaderboard weekly+streak sorts by streak then weekly coins")
    void getLeaderboard_weeklyStreak_sortedByTieBreak() {
        User u1 = user("u1", 2, 100, 3, 0, 0, Role.USER);
        User u2 = user("u2", 3, 50, 5, 0, 0, Role.USER);
        User u3 = user("u3", 4, 90, 5, 0, 0, Role.USER);

        when(userRepository.findAllByRoleNotOrderByWeeklyCoinsCollectedDescLevelDesc(
                Role.ADMIN, PageRequest.of(0, 3)))
                .thenReturn(new PageImpl<>(List.of(u1, u2, u3)));

        List<LeaderboardEntryDTO> result = leaderboardService.getLeaderboard(3, "weekly", "streak");

        assertEquals(3, result.size());
        assertEquals("u3", result.get(0).getUsername());
        assertEquals("u2", result.get(1).getUsername());
        assertEquals("u1", result.get(2).getUsername());
        assertEquals(1, result.get(0).getRank());
        assertEquals(90, result.get(0).getCoins());
    }

    @Test
    @DisplayName("getMyRank returns rank 0 and null entry for admin")
    void getMyRank_adminSpecialCase() {
        User admin = user("admin", 1, 0, 0, 0, 0, Role.ADMIN);
        when(userService.getCurrentUserReadOnly()).thenReturn(admin);

        Map<String, Object> result = leaderboardService.getMyRank("allTime", "coins");

        assertEquals(0, result.get("rank"));
        assertNull(result.get("entry"));
    }

    @Test
    @DisplayName("getMyRank weekly+streak computes rank from count queries")
    void getMyRank_weeklyStreak_calculatesRank() {
        User current = user("alice", 5, 80, 5, 1000, 80, Role.USER);
        when(userService.getCurrentUserReadOnly()).thenReturn(current);

        when(userRepository.countByRoleNotAndStreakGreaterThan(Role.ADMIN, 5)).thenReturn(2L);
        when(userRepository.countByRoleNotAndStreakAndWeeklyCoinsCollectedGreaterThan(Role.ADMIN, 5, 80)).thenReturn(1L);

        Map<String, Object> result = leaderboardService.getMyRank("weekly", "streak");

        assertEquals(4L, result.get("rank"));
        LeaderboardEntryDTO entry = (LeaderboardEntryDTO) result.get("entry");
        assertEquals(4, entry.getRank());
        assertEquals("alice", entry.getUsername());
        assertEquals(80, entry.getCoins());
    }

    private User user(String username,
                      int level,
                      int weeklyCoinsCollected,
                      int streak,
                      int totalCoinsCollected,
                      int weeklyCoins,
                      Role role) {
        User u = new User();
        u.setUsername(username);
        u.setLevel(level);
        u.setWeeklyCoinsCollected(weeklyCoinsCollected);
        u.setStreak(streak);
        u.setTotalCoinsCollected(totalCoinsCollected);
        u.setWeeklyCoins(weeklyCoins);
        u.setRole(role);
        return u;
    }
}
