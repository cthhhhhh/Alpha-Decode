package com.csd.cs203t1.flag;

import java.time.LocalDateTime;
import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.csd.cs203t1.admin.SessionTracker;
import com.csd.cs203t1.security.CustomUserDetailsService;
import com.csd.cs203t1.security.JwtFilter;
import com.csd.cs203t1.security.JwtUtil;
import com.csd.cs203t1.security.SecurityConfig;
import com.csd.cs203t1.user.User;
import com.csd.cs203t1.user.UserService;

@WebMvcTest(FlagController.class)
@Import({SecurityConfig.class, JwtFilter.class})
@DisplayName("FlagController WebMvc Tests")
class FlagControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private FlagService flagService;

    @MockBean
    private UserService userService;

    @MockBean
    private SessionTracker sessionTracker;

    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private CustomUserDetailsService userDetailsService;

    @Test
    @DisplayName("GET /api/flags/reasons is public")
    void getFlagReasons_public_success() throws Exception {
        when(flagService.getFlagReasons()).thenReturn(List.of("SPAM", "OTHER"));

        mockMvc.perform(get("/api/flags/reasons"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0]").value("SPAM"));
    }

    @Test
    @WithMockUser
    @DisplayName("POST /api/flags returns 200 for authenticated user")
    void createFlag_authenticated_success() throws Exception {
        User reporter = new User();
        reporter.setUsername("alice");
        when(userService.getCurrentUserReadOnly()).thenReturn(reporter);

        FlagDTO.FlagResponse response = new FlagDTO.FlagResponse(
                1L, "QUESTION", 12L, "SPAM", "details", "PENDING", LocalDateTime.now(), "alice", "ctx"
        );
        when(flagService.createFlag(org.mockito.ArgumentMatchers.any(FlagDTO.CreateFlagRequest.class), eq(reporter)))
                .thenReturn(response);

        String body = """
                {
                  "contentType": "question",
                  "contentId": 12,
                  "reason": "spam",
                  "details": "details",
                  "contentContext": "ctx"
                }
                """;

        mockMvc.perform(post("/api/flags")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.reason").value("SPAM"));
    }

    @Test
    @WithMockUser
    @DisplayName("POST /api/flags returns 401 when current user missing")
    void createFlag_missingUser_returns401() throws Exception {
        when(userService.getCurrentUserReadOnly()).thenReturn(null);

        String body = """
                {
                  "contentType": "question",
                  "contentId": 12,
                  "reason": "spam"
                }
                """;

        mockMvc.perform(post("/api/flags")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("Session expired. Please log in again."));
    }

    @Test
    @WithMockUser(roles = "USER")
    @DisplayName("GET /api/flags is forbidden for non-admin")
    void getAllFlags_nonAdmin_forbidden() throws Exception {
        mockMvc.perform(get("/api/flags"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("GET /api/flags returns all flags for admin")
    void getAllFlags_admin_success() throws Exception {
        when(flagService.getAllFlags()).thenReturn(List.of());

        mockMvc.perform(get("/api/flags"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("PATCH /api/flags/{id}/status updates status")
    void updateFlagStatus_admin_success() throws Exception {
        FlagDTO.FlagResponse response = new FlagDTO.FlagResponse(
                2L, "TERM", 3L, "OTHER", "", "REVIEWED", LocalDateTime.now(), "alice", "ctx"
        );
        when(flagService.updateStatus(2L, "REVIEWED")).thenReturn(response);

        mockMvc.perform(patch("/api/flags/2/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"REVIEWED\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("REVIEWED"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("DELETE /api/flags/resolved returns 204")
    void deleteResolvedFlags_admin_success() throws Exception {
        doNothing().when(flagService).deleteResolvedFlags();

        mockMvc.perform(delete("/api/flags/resolved"))
                .andExpect(status().isNoContent());
    }
}
