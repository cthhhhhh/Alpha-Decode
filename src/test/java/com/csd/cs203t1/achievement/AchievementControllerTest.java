package com.csd.cs203t1.achievement;

import java.util.Collections;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import static org.mockito.Mockito.when;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.csd.cs203t1.admin.SessionTracker;
import com.csd.cs203t1.security.CustomUserDetailsService;
import com.csd.cs203t1.security.JwtFilter;
import com.csd.cs203t1.security.JwtUtil;
import com.csd.cs203t1.security.SecurityConfig;
import com.csd.cs203t1.user.User;
import com.csd.cs203t1.user.UserService;

@WebMvcTest(AchievementController.class)
@Import({SecurityConfig.class, JwtFilter.class})
@DisplayName("AchievementController Unit Tests")
class AchievementControllerTest {

    @Autowired private MockMvc mockMvc;

    @MockBean private AchievementService achievementService;
    @MockBean private UserService userService;
    @MockBean private SessionTracker sessionTracker; // Needed by JwtFilter
    @MockBean private JwtUtil jwtUtil;
    @MockBean private CustomUserDetailsService userDetailsService;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setUsername("testuser");
    }

    @Test
    @DisplayName("GET /api/achievements: success returns catalog")
    void getAllAchievements_success() throws Exception {
        when(achievementService.getAllAchievements()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/achievements"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser
    @DisplayName("GET /api/achievements/me: success for authenticated user")
    void getMyAchievements_authenticated_success() throws Exception {
        when(userService.getCurrentUser()).thenReturn(user);
        when(achievementService.getUserAchievements(user)).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/achievements/me"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("GET /api/achievements/me: returns 401 when not authenticated")
    void getMyAchievements_noAuth_returns401() throws Exception {
        when(userService.getCurrentUserReadOnly()).thenThrow(new RuntimeException("Not authenticated"));

        mockMvc.perform(get("/api/achievements/me"))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("Not authenticated"));
    }
}
