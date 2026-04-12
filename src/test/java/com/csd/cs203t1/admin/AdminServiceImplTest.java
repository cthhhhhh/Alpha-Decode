package com.csd.cs203t1.admin;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.csd.cs203t1.common.Role;
import com.csd.cs203t1.user.User;
import com.csd.cs203t1.user.UserRepository;

@ExtendWith(MockitoExtension.class)
@DisplayName("AdminServiceImpl Unit Tests")
class AdminServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private SessionTracker sessionTracker;

    @InjectMocks
    private AdminServiceImpl adminService;

    @Test
    @DisplayName("getAdminStats aggregates repository and session data")
    void getAdminStats_returnsExpectedMap() {
        when(userRepository.countByRole(Role.USER)).thenReturn(11L);
        when(userRepository.countByRole(Role.CONTRIBUTOR)).thenReturn(3L);
        when(sessionTracker.getActiveCount()).thenReturn(5L);

        Map<String, Object> stats = adminService.getAdminStats();

        assertEquals(11L, stats.get("totalUsers"));
        assertEquals(3L, stats.get("contributors"));
        assertEquals(5L, stats.get("activeSessions"));
        assertEquals("Excellent", stats.get("systemHealth"));
    }

    @Test
    @DisplayName("updateUserRole changes role and clears pendingApproval for non-contributor")
    void updateUserRole_nonContributor_clearsPendingApproval() {
        User user = new User();
        user.setRole(Role.CONTRIBUTOR);
        user.setPendingApproval(true);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        adminService.updateUserRole(1L, "user");

        assertEquals(Role.USER, user.getRole());
        assertFalse(user.isPendingApproval());
        verify(userRepository).save(user);
    }

    @Test
    @DisplayName("approveContributor throws when user is not pending approval")
    void approveContributor_notPending_throws() {
        User user = new User();
        user.setPendingApproval(false);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> adminService.approveContributor(1L));

        assertEquals("User is not pending approval", ex.getMessage());
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("approveContributor sets contributor role and enables user")
    void approveContributor_pending_updatesUser() {
        User user = new User();
        user.setPendingApproval(true);
        user.setEnabled(false);
        user.setRole(Role.USER);

        when(userRepository.findById(2L)).thenReturn(Optional.of(user));

        adminService.approveContributor(2L);

        assertEquals(Role.CONTRIBUTOR, user.getRole());
        assertFalse(user.isPendingApproval());
        assertTrue(user.isEnabled());
        verify(userRepository).save(user);
    }

    @Test
    @DisplayName("getPendingContributors maps expected fields")
    void getPendingContributors_mapsFields() {
        User user = new User();
        user.setId(10L);
        user.setUsername("alice");
        user.setEmail("alice@example.com");
        user.setRole(Role.CONTRIBUTOR);
        user.setEnabled(false);
        user.setPendingApproval(true);

        when(userRepository.findByRoleAndPendingApprovalTrue(Role.CONTRIBUTOR)).thenReturn(List.of(user));

        List<Map<String, Object>> out = adminService.getPendingContributors();

        assertEquals(1, out.size());
        assertEquals("alice", out.get(0).get("username"));
        assertEquals("CONTRIBUTOR", out.get(0).get("role"));
        assertEquals(true, out.get(0).get("pendingApproval"));
    }

    @Test
    @DisplayName("getUserStats returns Never when no last quiz date")
    void getUserStats_nullDate_returnsNever() {
        User user = new User();
        user.setCoins(50);
        user.setLevel(3);
        user.setStreak(4);
        user.setMaxUnlockedLessonIndex(7);
        user.setDailyQuizCount(9);
        user.setDailyQuizLastDate(null);

        when(userRepository.findById(3L)).thenReturn(Optional.of(user));

        Map<String, Object> out = adminService.getUserStats(3L);

        assertEquals(50, out.get("coins"));
        assertEquals(3, out.get("level"));
        assertEquals("Never", out.get("lastActive"));
    }

    @Test
    @DisplayName("getAllUsers includes online status from SessionTracker")
    void getAllUsers_includesOnlineStatus() {
        User user = new User();
        user.setId(1L);
        user.setUsername("bob");
        user.setEmail("bob@example.com");
        user.setRole(Role.USER);
        user.setLevel(2);
        user.setCoins(10);
        user.setEnabled(true);
        user.setPendingApproval(false);

        when(userRepository.findAll()).thenReturn(List.of(user));
        when(sessionTracker.isOnline("bob")).thenReturn(true);

        List<Map<String, Object>> out = adminService.getAllUsers();

        assertEquals(1, out.size());
        assertEquals(true, out.get(0).get("isOnline"));
    }
}