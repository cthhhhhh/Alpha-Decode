package com.csd.cs203t1.user;

import com.csd.cs203t1.achievement.AchievementService;
import com.csd.cs203t1.achievement.UserAchievementRepository;
import com.csd.cs203t1.bookmark.UserBookmarkRepository;
import com.csd.cs203t1.common.Role;
import com.csd.cs203t1.draft.DraftRepository;
import com.csd.cs203t1.flag.FlagRepository;
import com.csd.cs203t1.security.JwtUtil;
import com.csd.cs203t1.shop.ItemRepository;
import com.csd.cs203t1.shop.UserItemRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("UserServiceImpl Unit Tests")
class UserServiceImplTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtUtil jwtUtil;
    @Mock private AchievementService achievementService;
    @Mock private UserAchievementRepository userAchievementRepository;
    @Mock private UserBookmarkRepository userBookmarkRepository;
    @Mock private FlagRepository flagRepository;
    @Mock private ItemRepository itemRepository;
    @Mock private UserItemRepository userItemRepository;
    @Mock private DraftRepository draftRepository;

    @InjectMocks
    private UserServiceImpl userService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
        testUser.setPassword("hashed_password");
        testUser.setRole(Role.USER);
        testUser.setEnabled(true);
        testUser.setCoins(100);
        testUser.setLevel(3);
    }

    // ─── register() ─────────────────────────────────────────────────────────────

    @Test
    @DisplayName("register: success — creates user and returns auth response with token")
    void register_validRequest_returnsAuthResponse() {
        UserDTO.RegisterRequest req = new UserDTO.RegisterRequest();
        req.setUsername("newuser");
        req.setEmail("new@example.com");
        req.setPassword("password123");

        when(userRepository.existsByUsername("newuser")).thenReturn(false);
        when(userRepository.existsByEmail("new@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("hashed");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> {
            User u = inv.getArgument(0);
            u.setId(2L);
            return u;
        });
        when(jwtUtil.generateToken(any())).thenReturn("mock-jwt-token");

        UserDTO.AuthResponse response = userService.register(req);

        assertNotNull(response);
        assertEquals("mock-jwt-token", response.getToken());
        assertEquals("newuser", response.getUsername());
        assertEquals("USER", response.getRole());
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("register: duplicate username — throws IllegalArgumentException")
    void register_duplicateUsername_throwsException() {
        UserDTO.RegisterRequest req = new UserDTO.RegisterRequest();
        req.setUsername("testuser");
        req.setEmail("another@example.com");
        req.setPassword("password123");

        when(userRepository.existsByUsername("testuser")).thenReturn(true);

        IllegalArgumentException ex = assertThrows(
            IllegalArgumentException.class,
            () -> userService.register(req)
        );
        assertEquals("Username is already taken", ex.getMessage());
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("register: duplicate email — throws IllegalArgumentException")
    void register_duplicateEmail_throwsException() {
        UserDTO.RegisterRequest req = new UserDTO.RegisterRequest();
        req.setUsername("brandnew");
        req.setEmail("test@example.com");
        req.setPassword("password123");

        when(userRepository.existsByUsername("brandnew")).thenReturn(false);
        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);

        IllegalArgumentException ex = assertThrows(
            IllegalArgumentException.class,
            () -> userService.register(req)
        );
        assertEquals("Email is already registered", ex.getMessage());
    }

    // ─── registerContributor() ───────────────────────────────────────────────────

    @Test
    @DisplayName("registerContributor: creates disabled account pending approval")
    void registerContributor_success_accountDisabledAndPending() {
        UserDTO.RegisterRequest req = new UserDTO.RegisterRequest();
        req.setUsername("contrib");
        req.setEmail("contrib@example.com");
        req.setPassword("pass123");

        when(userRepository.existsByUsername("contrib")).thenReturn(false);
        when(userRepository.existsByEmail("contrib@example.com")).thenReturn(false);
        when(passwordEncoder.encode("pass123")).thenReturn("hashed");

        userService.registerContributor(req);

        verify(userRepository).save(argThat(u ->
            !u.isEnabled()
            && u.isPendingApproval()
            && u.getRole() == Role.CONTRIBUTOR
        ));
    }

    // ─── login() ─────────────────────────────────────────────────────────────────

    @Test
    @DisplayName("login: valid credentials — returns auth response")
    void login_validCredentials_returnsAuthResponse() {
        UserDTO.LoginRequest req = new UserDTO.LoginRequest();
        req.setUsername("testuser");
        req.setPassword("password123");

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("password123", "hashed_password")).thenReturn(true);
        when(userRepository.save(testUser)).thenReturn(testUser);
        when(jwtUtil.generateToken(any())).thenReturn("jwt-token");

        UserDTO.AuthResponse response = userService.login(req);

        assertNotNull(response);
        assertEquals("jwt-token", response.getToken());
        assertEquals("testuser", response.getUsername());
    }

    @Test
    @DisplayName("login: user not found — throws IllegalArgumentException")
    void login_userNotFound_throwsException() {
        UserDTO.LoginRequest req = new UserDTO.LoginRequest();
        req.setUsername("ghost");
        req.setPassword("password");

        when(userRepository.findByUsername("ghost")).thenReturn(Optional.empty());

        IllegalArgumentException ex = assertThrows(
            IllegalArgumentException.class,
            () -> userService.login(req)
        );
        assertEquals("Invalid username or password", ex.getMessage());
    }

    @Test
    @DisplayName("login: wrong password — throws IllegalArgumentException")
    void login_wrongPassword_throwsException() {
        UserDTO.LoginRequest req = new UserDTO.LoginRequest();
        req.setUsername("testuser");
        req.setPassword("wrongpass");

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("wrongpass", "hashed_password")).thenReturn(false);

        IllegalArgumentException ex = assertThrows(
            IllegalArgumentException.class,
            () -> userService.login(req)
        );
        assertEquals("Invalid username or password", ex.getMessage());
    }

    @Test
    @DisplayName("login: disabled contributor account — throws with pending message")
    void login_disabledContributorAccount_throwsPendingMessage() {
        testUser.setEnabled(false);
        testUser.setRole(Role.CONTRIBUTOR);

        UserDTO.LoginRequest req = new UserDTO.LoginRequest();
        req.setUsername("testuser");
        req.setPassword("password123");

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("password123", "hashed_password")).thenReturn(true);

        IllegalArgumentException ex = assertThrows(
            IllegalArgumentException.class,
            () -> userService.login(req)
        );
        assertTrue(ex.getMessage().contains("pending admin approval"));
    }

    // ─── verifyUserForReset() ────────────────────────────────────────────────────

    @Test
    @DisplayName("verifyUserForReset: matching username and email — returns true")
    void verifyUserForReset_matchingCredentials_returnsTrue() {
        UserDTO.VerifyUserRequest req = new UserDTO.VerifyUserRequest();
        req.setUsername("testuser");
        req.setEmail("test@example.com");

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));

        assertTrue(userService.verifyUserForReset(req));
    }

    @Test
    @DisplayName("verifyUserForReset: wrong email — returns false")
    void verifyUserForReset_wrongEmail_returnsFalse() {
        UserDTO.VerifyUserRequest req = new UserDTO.VerifyUserRequest();
        req.setUsername("testuser");
        req.setEmail("wrong@example.com");

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));

        assertFalse(userService.verifyUserForReset(req));
    }

    @Test
    @DisplayName("verifyUserForReset: user does not exist — returns false")
    void verifyUserForReset_userNotFound_returnsFalse() {
        UserDTO.VerifyUserRequest req = new UserDTO.VerifyUserRequest();
        req.setUsername("nobody");
        req.setEmail("test@example.com");

        when(userRepository.findByUsername("nobody")).thenReturn(Optional.empty());

        assertFalse(userService.verifyUserForReset(req));
    }

    // ─── resetPassword() ────────────────────────────────────────────────────────

    @Test
    @DisplayName("resetPassword: valid new password — encodes and saves")
    void resetPassword_validPassword_savesUser() {
        UserDTO.ResetPasswordRequest req = new UserDTO.ResetPasswordRequest();
        req.setUsername("testuser");
        req.setNewPassword("newpassword");

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("newpassword", "hashed_password")).thenReturn(false);
        when(passwordEncoder.encode("newpassword")).thenReturn("new_hashed");

        userService.resetPassword(req);

        verify(passwordEncoder).encode("newpassword");
        verify(userRepository).save(testUser);
        assertEquals("new_hashed", testUser.getPassword());
    }

    @Test
    @DisplayName("resetPassword: password too short — throws IllegalArgumentException")
    void resetPassword_shortPassword_throwsException() {
        UserDTO.ResetPasswordRequest req = new UserDTO.ResetPasswordRequest();
        req.setUsername("testuser");
        req.setNewPassword("abc");

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));

        IllegalArgumentException ex = assertThrows(
            IllegalArgumentException.class,
            () -> userService.resetPassword(req)
        );
        assertTrue(ex.getMessage().contains("at least 6 characters"));
    }

    @Test
    @DisplayName("resetPassword: same as old password — throws IllegalArgumentException")
    void resetPassword_sameAsOld_throwsException() {
        UserDTO.ResetPasswordRequest req = new UserDTO.ResetPasswordRequest();
        req.setUsername("testuser");
        req.setNewPassword("samepassword");

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("samepassword", "hashed_password")).thenReturn(true);

        IllegalArgumentException ex = assertThrows(
            IllegalArgumentException.class,
            () -> userService.resetPassword(req)
        );
        assertTrue(ex.getMessage().contains("same as the old password"));
    }

    // ─── resetProgress() ────────────────────────────────────────────────────────

    @Test
    @DisplayName("resetProgress: resets all progress fields to defaults")
    void resetProgress_existingUser_resetsFields() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.save(testUser)).thenReturn(testUser);

        userService.resetProgress(1L);

        assertEquals(0, testUser.getCoins());
        assertEquals(0, testUser.getWeeklyCoins());
        assertEquals(1, testUser.getLevel());
        assertEquals(0, testUser.getStreak());
        assertEquals(0, testUser.getMaxUnlockedLessonIndex());
        assertEquals(0, testUser.getDailyQuizCount());
        assertNull(testUser.getDailyQuizLastDate());
        verify(userRepository).save(testUser);
    }

    @Test
    @DisplayName("resetProgress: null id — throws NullPointerException")
    void resetProgress_nullId_throwsException() {
        assertThrows(NullPointerException.class, () -> userService.resetProgress(null));
    }

    @Test
    @DisplayName("resetProgress: user not found — throws RuntimeException")
    void resetProgress_userNotFound_throwsException() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> userService.resetProgress(99L));
    }

    // ─── setUserEnabled() ────────────────────────────────────────────────────────

    @Test
    @DisplayName("setUserEnabled: enables user and clears pending approval")
    void setUserEnabled_enableUser_updatesFlags() {
        testUser.setEnabled(false);
        testUser.setPendingApproval(true);

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.save(testUser)).thenReturn(testUser);

        userService.setUserEnabled(1L, true);

        assertTrue(testUser.isEnabled());
        assertFalse(testUser.isPendingApproval());
        verify(userRepository).save(testUser);
    }

    @Test
    @DisplayName("setUserEnabled: disables user")
    void setUserEnabled_disableUser_setsEnabledFalse() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.save(testUser)).thenReturn(testUser);

        userService.setUserEnabled(1L, false);

        assertFalse(testUser.isEnabled());
    }

    // ─── checkStreakLapse (tested via login) ─────────────────────────────────────

    @Test
    @DisplayName("login: streak is reset when last quiz was more than 1 day ago")
    void login_streakLapsed_resetsStreakToZero() {
        testUser.setStreak(10);
        testUser.setDailyQuizLastDate(LocalDate.now().minusDays(3));

        UserDTO.LoginRequest req = new UserDTO.LoginRequest();
        req.setUsername("testuser");
        req.setPassword("password123");

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("password123", "hashed_password")).thenReturn(true);
        when(userRepository.save(testUser)).thenReturn(testUser);
        when(jwtUtil.generateToken(any())).thenReturn("token");

        userService.login(req);

        assertEquals(0, testUser.getStreak());
    }

    @Test
    @DisplayName("login: streak is NOT reset when last quiz was yesterday")
    void login_streakYesterday_doesNotResetStreak() {
        testUser.setStreak(5);
        testUser.setDailyQuizLastDate(LocalDate.now().minusDays(1));

        UserDTO.LoginRequest req = new UserDTO.LoginRequest();
        req.setUsername("testuser");
        req.setPassword("password123");

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("password123", "hashed_password")).thenReturn(true);
        when(userRepository.save(testUser)).thenReturn(testUser);
        when(jwtUtil.generateToken(any())).thenReturn("token");

        userService.login(req);

        assertEquals(5, testUser.getStreak());
    }

    // ─── BOUNDARY VALUE ANALYSIS (BVA) TESTS ─────────────────────────────────────
    // Password length boundary: validation rule is length < 6 (minimum valid = 6)
    //   Partition: INVALID passwords → length ≤ 5
    //   Partition: VALID passwords   → length ≥ 6
    //
    // BVA tests the value just below (5), on (6), and just above (7) the boundary.

    @Test
    @DisplayName("BVA | resetPassword: 5-char password (below boundary) — throws exception")
    void bva_resetPassword_5chars_belowBoundary_throwsException() {
        // ARRANGE
        UserDTO.ResetPasswordRequest req = new UserDTO.ResetPasswordRequest();
        req.setUsername("testuser");
        req.setNewPassword("abcde"); // exactly 5 characters — INVALID (below boundary)

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));

        // ACT + ASSERT
        IllegalArgumentException ex = assertThrows(
            IllegalArgumentException.class,
            () -> userService.resetPassword(req)
        );
        assertTrue(ex.getMessage().contains("at least 6 characters"));
    }

    @Test
    @DisplayName("BVA | resetPassword: 6-char password (on boundary) — succeeds")
    void bva_resetPassword_6chars_onBoundary_succeeds() {
        // ARRANGE
        UserDTO.ResetPasswordRequest req = new UserDTO.ResetPasswordRequest();
        req.setUsername("testuser");
        req.setNewPassword("abcdef"); // exactly 6 characters — VALID (on boundary)

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("abcdef", "hashed_password")).thenReturn(false);
        when(passwordEncoder.encode("abcdef")).thenReturn("new_hashed");

        // ACT — should not throw any exception
        assertDoesNotThrow(() -> userService.resetPassword(req));

        // ASSERT — password was saved
        verify(userRepository).save(testUser);
    }

    @Test
    @DisplayName("BVA | resetPassword: 7-char password (above boundary) — succeeds")
    void bva_resetPassword_7chars_aboveBoundary_succeeds() {
        // ARRANGE
        UserDTO.ResetPasswordRequest req = new UserDTO.ResetPasswordRequest();
        req.setUsername("testuser");
        req.setNewPassword("abcdefg"); // exactly 7 characters — VALID (above boundary)

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("abcdefg", "hashed_password")).thenReturn(false);
        when(passwordEncoder.encode("abcdefg")).thenReturn("new_hashed");

        // ACT + ASSERT
        assertDoesNotThrow(() -> userService.resetPassword(req));
        verify(userRepository).save(testUser);
    }

    // ─── BVA: Streak Lapse Boundary ───────────────────────────────────────────────
    // Rule: streak resets if lastDate.isBefore(today.minusDays(1))
    // i.e., resets only if lastDate is MORE than 1 day ago (≥ 2 days ago)
    //   lastDate = today - 1 day (boundary ON) → streak NOT reset
    //   lastDate = today - 2 days (just past boundary) → streak IS reset

    @Test
    @DisplayName("BVA | streak: last quiz exactly 1 day ago (on boundary) — streak preserved")
    void bva_streak_1DayAgo_onBoundary_streakPreserved() {
        // ARRANGE
        testUser.setStreak(7);
        testUser.setDailyQuizLastDate(LocalDate.now().minusDays(1)); // exactly 1 day ago

        UserDTO.LoginRequest req = new UserDTO.LoginRequest();
        req.setUsername("testuser");
        req.setPassword("password123");

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("password123", "hashed_password")).thenReturn(true);
        when(userRepository.save(testUser)).thenReturn(testUser);
        when(jwtUtil.generateToken(any())).thenReturn("token");

        // ACT
        userService.login(req);

        // ASSERT — streak must NOT be reset
        assertEquals(7, testUser.getStreak());
    }

    @Test
    @DisplayName("BVA | streak: last quiz exactly 2 days ago (just past boundary) — streak reset to 0")
    void bva_streak_2DaysAgo_justPastBoundary_streakReset() {
        // ARRANGE
        testUser.setStreak(7);
        testUser.setDailyQuizLastDate(LocalDate.now().minusDays(2)); // 2 days ago — past boundary

        UserDTO.LoginRequest req = new UserDTO.LoginRequest();
        req.setUsername("testuser");
        req.setPassword("password123");

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("password123", "hashed_password")).thenReturn(true);
        when(userRepository.save(testUser)).thenReturn(testUser);
        when(jwtUtil.generateToken(any())).thenReturn("token");

        // ACT
        userService.login(req);

        // ASSERT — streak MUST be reset to 0
        assertEquals(0, testUser.getStreak());
    }
}
