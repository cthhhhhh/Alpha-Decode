package com.csd.cs203t1.achievement;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.csd.cs203t1.common.Role;
import com.csd.cs203t1.user.User;

@ExtendWith(MockitoExtension.class)
@DisplayName("AchievementServiceImpl Unit Tests")
class AchievementServiceImplTest {

    @Mock
    private AchievementRepository achievementRepository;

    @Mock
    private UserAchievementRepository userAchievementRepository;

    @InjectMocks
    private AchievementServiceImpl achievementService;

    @Test
    @DisplayName("checkAndUnlock: admin unlocks all non-unlocked achievements")
    void checkAndUnlock_adminUnlocksAllMissing() {
        User admin = user(Role.ADMIN);
        Achievement a1 = achievement(1L, "Starter", TriggerType.LESSON_COMPLETE, 1);
        Achievement a2 = achievement(2L, "Grinder", TriggerType.STREAK_DAYS, 3);

        UserAchievement alreadyUnlocked = UserAchievement.builder()
                .user(admin)
                .achievement(a1)
                .unlockedAt(LocalDateTime.now().minusDays(1))
                .build();

        when(achievementRepository.findAll()).thenReturn(List.of(a1, a2));
        when(userAchievementRepository.findByUser(admin)).thenReturn(List.of(alreadyUnlocked));

        List<Achievement> newlyUnlocked = achievementService.checkAndUnlock(admin);

        assertEquals(1, newlyUnlocked.size());
        assertEquals(2L, newlyUnlocked.get(0).getId());

        ArgumentCaptor<UserAchievement> uaCaptor = ArgumentCaptor.forClass(UserAchievement.class);
        verify(userAchievementRepository).save(uaCaptor.capture());
        assertEquals(admin, uaCaptor.getValue().getUser());
        assertEquals(2L, uaCaptor.getValue().getAchievement().getId());
    }

    @Test
    @DisplayName("checkAndUnlock: regular user unlocks only threshold-matching achievements")
    void checkAndUnlock_userUnlocksOnlyQualifiedAchievements() {
        User user = user(Role.USER);
        user.setMaxUnlockedLessonIndex(4);
        user.setStreak(3);
        user.setDailyQuizCount(2);
        user.setCoins(120);

        Achievement lessonAch = achievement(11L, "Lessons", TriggerType.LESSON_COMPLETE, 4);
        Achievement streakAch = achievement(12L, "Streak", TriggerType.STREAK_DAYS, 5);
        Achievement dailyAch = achievement(13L, "Daily", TriggerType.DAILY_QUIZ_COUNT, 2);
        Achievement coinsAch = achievement(14L, "Coins", TriggerType.COINS_REACHED, 100);
        Achievement xpAch = achievement(15L, "XP", TriggerType.XP_REACHED, 200);

        when(achievementRepository.findAll()).thenReturn(List.of(lessonAch, streakAch, dailyAch, coinsAch, xpAch));
        when(userAchievementRepository.findByUser(user)).thenReturn(List.of());

        List<Achievement> newlyUnlocked = achievementService.checkAndUnlock(user);

        assertEquals(3, newlyUnlocked.size());
        assertTrue(newlyUnlocked.stream().anyMatch(a -> a.getId().equals(11L)));
        assertTrue(newlyUnlocked.stream().anyMatch(a -> a.getId().equals(13L)));
        assertTrue(newlyUnlocked.stream().anyMatch(a -> a.getId().equals(14L)));
        verify(userAchievementRepository, times(3)).save(any(UserAchievement.class));
    }

    @Test
    @DisplayName("getAllAchievements: maps entities to API DTO with lowercase trigger")
    void getAllAchievements_mapsToDto() {
        Achievement a = achievement(21L, "Combo", TriggerType.STREAK_DAYS, 7);
        a.setDescription("Seven-day streak");
        a.setIcon("icon-fire");

        when(achievementRepository.findAll()).thenReturn(List.of(a));

        List<AchievementDTO.AchievementInfo> results = achievementService.getAllAchievements();

        assertEquals(1, results.size());
        AchievementDTO.AchievementInfo dto = results.get(0);
        assertEquals(21L, dto.getId());
        assertEquals("Combo", dto.getName());
        assertEquals("streak_days", dto.getTriggerType());
        assertEquals(7, dto.getThreshold());
    }

    @Test
    @DisplayName("getUserAchievements: admin sees all achievements including those not persisted yet")
    void getUserAchievements_adminReturnsAll() {
        User admin = user(Role.ADMIN);
        Achievement a1 = achievement(31L, "A1", TriggerType.LESSON_COMPLETE, 1);
        Achievement a2 = achievement(32L, "A2", TriggerType.COINS_REACHED, 10);

        LocalDateTime unlockedAt = LocalDateTime.now().minusHours(2);
        UserAchievement unlockedA1 = UserAchievement.builder()
                .user(admin)
                .achievement(a1)
                .unlockedAt(unlockedAt)
                .build();

        when(userAchievementRepository.findByUser(admin)).thenReturn(List.of(unlockedA1));
        when(achievementRepository.findAll()).thenReturn(List.of(a1, a2));

        List<AchievementDTO.UserAchievementInfo> results = achievementService.getUserAchievements(admin);

        assertEquals(2, results.size());
        Optional<AchievementDTO.UserAchievementInfo> first = results.stream().filter(r -> r.getAchievementId().equals(31L)).findFirst();
        Optional<AchievementDTO.UserAchievementInfo> second = results.stream().filter(r -> r.getAchievementId().equals(32L)).findFirst();

        assertTrue(first.isPresent());
        assertTrue(second.isPresent());
        assertEquals(unlockedAt, first.get().getUnlockedAt());
        assertNotNull(second.get().getUnlockedAt());
    }

    @Test
    @DisplayName("getUserAchievements: regular user sees only unlocked achievements")
    void getUserAchievements_userReturnsOnlyUnlocked() {
        User user = user(Role.USER);
        Achievement a1 = achievement(41L, "A1", TriggerType.LESSON_COMPLETE, 1);
        LocalDateTime unlockedAt = LocalDateTime.now().minusDays(1);

        UserAchievement unlocked = UserAchievement.builder()
                .user(user)
                .achievement(a1)
                .unlockedAt(unlockedAt)
                .build();

        when(userAchievementRepository.findByUser(user)).thenReturn(List.of(unlocked));

        List<AchievementDTO.UserAchievementInfo> results = achievementService.getUserAchievements(user);

        assertEquals(1, results.size());
        assertEquals(41L, results.get(0).getAchievementId());
        assertEquals(unlockedAt, results.get(0).getUnlockedAt());
    }

    private User user(Role role) {
        User user = new User();
        user.setId(100L);
        user.setRole(role);
        user.setUsername("u");
        user.setEmail("u@example.com");
        user.setPassword("pw");
        return user;
    }

    private Achievement achievement(Long id, String name, TriggerType type, int threshold) {
        Achievement achievement = new Achievement();
        achievement.setId(id);
        achievement.setName(name);
        achievement.setDescription(name + " desc");
        achievement.setIcon(name + " icon");
        achievement.setTriggerType(type);
        achievement.setThreshold(threshold);
        return achievement;
    }
}