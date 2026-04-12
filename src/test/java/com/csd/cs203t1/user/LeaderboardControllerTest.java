package com.csd.cs203t1.user;

import com.csd.cs203t1.admin.SessionTracker;
import com.csd.cs203t1.security.CustomUserDetailsService;
import com.csd.cs203t1.security.JwtFilter;
import com.csd.cs203t1.security.JwtUtil;
import com.csd.cs203t1.security.SecurityConfig;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Map;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(LeaderboardController.class)
@Import({SecurityConfig.class, JwtFilter.class})
@DisplayName("LeaderboardController WebMvc Tests")
class LeaderboardControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private LeaderboardService leaderboardService;

    @MockBean
    private SessionTracker sessionTracker;

    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private CustomUserDetailsService userDetailsService;

    @Test
    @WithMockUser
    @DisplayName("GET /api/leaderboard uses default limit when query param missing")
    void getLeaderboard_usesDefaultLimit() throws Exception {
        when(leaderboardService.getLeaderboard(10, "allTime", "coins"))
                .thenReturn(List.of(new LeaderboardEntryDTO(1, "alice", 3, 120, 4)));

        mockMvc.perform(get("/api/leaderboard"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].username").value("alice"));

        verify(leaderboardService).getLeaderboard(10, "allTime", "coins");
    }

    @Test
    @WithMockUser
    @DisplayName("GET /api/leaderboard forwards custom params")
    void getLeaderboard_customParams_success() throws Exception {
        when(leaderboardService.getLeaderboard(5, "weekly", "streak"))
                .thenReturn(List.of());

        mockMvc.perform(get("/api/leaderboard")
                        .param("limit", "5")
                        .param("period", "weekly")
                        .param("sort", "streak"))
                .andExpect(status().isOk());

        verify(leaderboardService).getLeaderboard(5, "weekly", "streak");
    }

    @Test
    @WithMockUser
    @DisplayName("GET /api/leaderboard/me returns caller rank")
    void getMyRank_success() throws Exception {
        when(leaderboardService.getMyRank("allTime", "coins"))
                .thenReturn(Map.of("rank", 2, "entry", Map.of("username", "bob")));

        mockMvc.perform(get("/api/leaderboard/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.rank").value(2));
    }

    @Test
        @DisplayName("GET /api/leaderboard is accessible without explicit mock user")
        void getLeaderboard_withoutMockUser_returns200() throws Exception {
                when(leaderboardService.getLeaderboard(10, "allTime", "coins"))
                                .thenReturn(List.of());

        mockMvc.perform(get("/api/leaderboard"))
                                .andExpect(status().isOk());
    }
}
