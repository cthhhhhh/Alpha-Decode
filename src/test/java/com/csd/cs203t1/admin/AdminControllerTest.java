package com.csd.cs203t1.admin;

import java.util.Collections;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
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

import com.csd.cs203t1.common.Role;
import com.csd.cs203t1.security.CustomUserDetailsService;
import com.csd.cs203t1.security.JwtFilter;
import com.csd.cs203t1.security.JwtUtil;
import com.csd.cs203t1.security.SecurityConfig;
import com.csd.cs203t1.user.User;
import com.csd.cs203t1.user.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(AdminController.class)
@Import({SecurityConfig.class, JwtFilter.class})
@DisplayName("AdminController Unit Tests")
class AdminControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @MockBean private AdminService adminService;
    @MockBean private SessionTracker sessionTracker;
    @MockBean private UserService userService;
    @MockBean private JwtUtil jwtUtil;
    @MockBean private CustomUserDetailsService userDetailsService;

    private User adminUser;
    private User regularUser;

    @BeforeEach
    void setUp() {
        adminUser = new User();
        adminUser.setId(1L);
        adminUser.setUsername("admin");
        adminUser.setEmail("admin@test.com");
        adminUser.setRole(Role.ADMIN);

        regularUser = new User();
        regularUser.setId(2L);
        regularUser.setUsername("user");
        regularUser.setEmail("user@test.com");
        regularUser.setRole(Role.USER);
        regularUser.setEnabled(true);
        regularUser.setPendingApproval(false);
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("GET /api/admin/stats: success as ADMIN")
    void getAdminStats_asAdmin_returns200() throws Exception {
        when(adminService.getAdminStats()).thenReturn(Map.of(
            "totalUsers", 10,
            "contributors", 2,
            "activeSessions", 5,
            "systemHealth", "Excellent",
            "message", "Welcome"
        ));

        mockMvc.perform(get("/api/admin/stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalUsers").value(10))
                .andExpect(jsonPath("$.activeSessions").value(5));
    }

    @Test
    @WithMockUser(roles = "USER")
    @DisplayName("GET /api/admin/stats: forbidden as USER")
    void getAdminStats_asUser_returns403() throws Exception {
        mockMvc.perform(get("/api/admin/stats"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("GET /api/admin/users: returns users list")
    void getAllUsers_asAdmin_returns200() throws Exception {
        when(adminService.getAllUsers()).thenReturn(Collections.singletonList(Map.of(
            "id", 2,
            "username", "user",
            "email", "user@test.com",
            "role", "USER"
        )));

        mockMvc.perform(get("/api/admin/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].username").value("user"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("DELETE /api/admin/users/{id}: success")
    void deleteUser_asAdmin_success() throws Exception {
        when(userService.getCurrentUserReadOnly()).thenReturn(adminUser);

        mockMvc.perform(delete("/api/admin/users/2"))
                .andExpect(status().isOk());

        verify(userService).deleteUserById(2L);
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("DELETE /api/admin/users/{id}: cannot delete self")
    void deleteUser_self_returns400() throws Exception {
        when(userService.getCurrentUserReadOnly()).thenReturn(adminUser);

        mockMvc.perform(delete("/api/admin/users/1"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("You cannot delete yourself"));

        verify(userService, never()).deleteUserById(anyLong());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("POST /api/admin/users/{id}/bans: success")
    void banUser_asAdmin_success() throws Exception {
        when(userService.getCurrentUserReadOnly()).thenReturn(adminUser);

        mockMvc.perform(post("/api/admin/users/2/bans"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("User banned successfully"));

        verify(userService).setUserEnabled(2L, false);
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("DELETE /api/admin/users/{id}/bans: success")
    void unbanUser_nounRoute_success() throws Exception {
        mockMvc.perform(delete("/api/admin/users/2/bans"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("User unbanned successfully"));

        verify(userService).setUserEnabled(2L, true);
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("POST /api/admin/users/{id}/contributor-approvals: success")
    void approveContributor_valid_success() throws Exception {
        doNothing().when(adminService).approveContributor(2L);

        mockMvc.perform(post("/api/admin/users/2/contributor-approvals"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("User approved as contributor"));

        verify(adminService).approveContributor(2L);
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("DELETE /api/admin/users/{id}/progress: success")
    void resetProgress_nounRoute_success() throws Exception {
        doNothing().when(userService).resetProgress(2L);

        mockMvc.perform(delete("/api/admin/users/2/progress"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Progress reset successfully"));

        verify(userService).resetProgress(2L);
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("POST /api/admin/users/{id}/contributor-approvals: fails if not pending")
    void approveContributor_notPending_returns400() throws Exception {
        doThrow(new IllegalArgumentException("User is not pending approval"))
            .when(adminService).approveContributor(2L);

        mockMvc.perform(post("/api/admin/users/2/contributor-approvals"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("User is not pending approval"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("POST /api/admin/users/{id}/contributor-rejections: success")
    void rejectContributor_valid_success() throws Exception {
        doNothing().when(adminService).rejectContributor(2L);

        mockMvc.perform(post("/api/admin/users/2/contributor-rejections"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Contributor request rejected"));

        verify(adminService).rejectContributor(2L);
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("GET /api/admin/contributors/pending: returns list")
    void getPendingContributors_returnsList() throws Exception {
        when(adminService.getPendingContributors()).thenReturn(Collections.singletonList(Map.of(
            "id", 10,
            "username", "tester",
            "email", "tester@test.com",
            "role", "CONTRIBUTOR",
            "enabled", true,
            "pendingApproval", true
        )));

        mockMvc.perform(get("/api/admin/contributors/pending"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].username").value("tester"))
                .andExpect(jsonPath("$[0].pendingApproval").value(true));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("PATCH /api/admin/users/{id}/role: updates role")
    void updateUserRole_success() throws Exception {
        doNothing().when(adminService).updateUserRole(2L, "ADMIN");

        mockMvc.perform(patch("/api/admin/users/2/role")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of("role", "ADMIN"))))
                .andExpect(status().isOk());

        verify(adminService).updateUserRole(2L, "ADMIN");
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("GET /api/admin/users/{id}/stats: returns user stats")
    void getUserStats_asAdmin_returns200() throws Exception {
        when(adminService.getUserStats(2L)).thenReturn(Map.of(
            "coins", 50,
            "level", 3,
            "lastActive", "Never"
        ));

        mockMvc.perform(get("/api/admin/users/2/stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.coins").value(50))
                .andExpect(jsonPath("$.level").value(3));
    }
}
