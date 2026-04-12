package com.csd.cs203t1.user;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
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
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.csd.cs203t1.common.Role;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(UserController.class)
@Import({com.csd.cs203t1.security.SecurityConfig.class, com.csd.cs203t1.security.JwtFilter.class})
@DisplayName("UserController Integration Tests (MockMvc)")
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    // MockBean all beans that SecurityConfig / JwtFilter depend on so the
    // application context can start without a real database or JWT secret.
    @MockBean private UserService userService;
    @MockBean private com.csd.cs203t1.security.JwtUtil jwtUtil;
    @MockBean private com.csd.cs203t1.security.CustomUserDetailsService customUserDetailsService;
    @MockBean private com.csd.cs203t1.admin.SessionTracker sessionTracker;

    private UserDTO.AuthResponse sampleAuthResponse;

    @BeforeEach
    void setUp() {
        sampleAuthResponse = new UserDTO.AuthResponse(
            "mock-token",
            Role.USER.toString(),
            "testuser",
            1,
            0,
            0,
            0
        );
    }

    // ─── POST /api/users ──────────────────────────────────────────────────────────

    @Test
    @DisplayName("POST /users: valid request returns 200 with auth response")
    void register_validRequest_returns200() throws Exception {
        UserDTO.RegisterRequest req = new UserDTO.RegisterRequest();
        req.setUsername("newuser");
        req.setEmail("new@example.com");
        req.setPassword("password123");

        when(userService.register(any(UserDTO.RegisterRequest.class)))
            .thenReturn(sampleAuthResponse);

        mockMvc.perform(post("/api/users")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.token").value("mock-token"))
            .andExpect(jsonPath("$.username").value("testuser"))
            .andExpect(jsonPath("$.role").value("user"));
    }

    @Test
    @DisplayName("POST /users: duplicate username returns 400 with error message")
    void register_duplicateUsername_returns400() throws Exception {
        UserDTO.RegisterRequest req = new UserDTO.RegisterRequest();
        req.setUsername("existing");
        req.setEmail("test@example.com");
        req.setPassword("password123");

        when(userService.register(any(UserDTO.RegisterRequest.class)))
            .thenThrow(new IllegalArgumentException("Username is already taken"));

        mockMvc.perform(post("/api/users")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Username is already taken"));
    }

    // ─── POST /api/sessions ───────────────────────────────────────────────────────

    @Test
    @DisplayName("POST /sessions: valid credentials returns 200 with token")
    void login_validCredentials_returns200() throws Exception {
        UserDTO.LoginRequest req = new UserDTO.LoginRequest();
        req.setUsername("testuser");
        req.setPassword("password123");

        when(userService.login(any(UserDTO.LoginRequest.class)))
            .thenReturn(sampleAuthResponse);

        mockMvc.perform(post("/api/sessions")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.token").value("mock-token"));
    }

    @Test
    @DisplayName("POST /sessions: invalid password returns 400")
    void login_invalidPassword_returns400() throws Exception {
        UserDTO.LoginRequest req = new UserDTO.LoginRequest();
        req.setUsername("testuser");
        req.setPassword("wrongpass");

        when(userService.login(any(UserDTO.LoginRequest.class)))
            .thenThrow(new IllegalArgumentException("Invalid username or password"));

        mockMvc.perform(post("/api/sessions")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Invalid username or password"));
    }

    // ─── POST /api/contributor-registrations ─────────────────────────────────────

    @Test
    @DisplayName("POST /contributor-registrations: valid request returns 200 with message")
    void registerContributor_validRequest_returns200() throws Exception {
        UserDTO.RegisterRequest req = new UserDTO.RegisterRequest();
        req.setUsername("contrib");
        req.setEmail("contrib@example.com");
        req.setPassword("pass123");

        doNothing().when(userService).registerContributor(any(UserDTO.RegisterRequest.class));

        mockMvc.perform(post("/api/contributor-registrations")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.message").value(
                "Registration successful. Await admin approval before logging in."));
    }

    @Test
    @DisplayName("POST /contributor-registrations: duplicate username returns 400")
    void registerContributor_duplicateUsername_returns400() throws Exception {
        UserDTO.RegisterRequest req = new UserDTO.RegisterRequest();
        req.setUsername("taken");
        req.setEmail("taken@example.com");
        req.setPassword("pass123");

        doThrow(new IllegalArgumentException("Username is already taken"))
            .when(userService).registerContributor(any(UserDTO.RegisterRequest.class));

        mockMvc.perform(post("/api/contributor-registrations")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Username is already taken"));
    }

    // ─── POST /api/admin/users (security rule) ──────────────────────────────────

    @Test
    @WithMockUser(roles = "USER")
    @DisplayName("POST /admin/users: USER role is forbidden")
    void registerAdmin_asUser_returns403() throws Exception {
        UserDTO.RegisterRequest req = new UserDTO.RegisterRequest();
        req.setUsername("admincandidate");
        req.setEmail("admin@example.com");
        req.setPassword("password123");

        mockMvc.perform(post("/api/admin/users")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isForbidden());

        verify(userService, never()).registerAdmin(any(UserDTO.RegisterRequest.class));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("POST /admin/users: ADMIN role can access")
    void registerAdmin_asAdmin_returns200() throws Exception {
        UserDTO.RegisterRequest req = new UserDTO.RegisterRequest();
        req.setUsername("newadmin");
        req.setEmail("newadmin@example.com");
        req.setPassword("password123");

        when(userService.registerAdmin(any(UserDTO.RegisterRequest.class)))
            .thenReturn(sampleAuthResponse);

        mockMvc.perform(post("/api/admin/users")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.token").value("mock-token"));
    }

    // ─── GET /api/users/me ────────────────────────────────────────────────────────

    @Test
    @WithMockUser(username = "testuser")
    @DisplayName("GET /users/me: authenticated user returns 200 with profile")
    void getMe_authenticated_returns200() throws Exception {
        when(userService.getMe()).thenReturn(sampleAuthResponse);

        mockMvc.perform(get("/api/users/me"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.username").value("testuser"));
    }

    @Test
    @WithMockUser(username = "testuser")
    @DisplayName("GET /users/me: service throws exception returns 401")
    void getMe_serviceThrows_returns401() throws Exception {
        when(userService.getMe()).thenThrow(new RuntimeException("Not found"));

        mockMvc.perform(get("/api/users/me"))
            .andExpect(status().isUnauthorized())
            .andExpect(content().string("Not authenticated"));
    }


    // ─── POST /api/password-reset-verifications ──────────────────────────────────

    @Test
    @DisplayName("POST /password-reset-verifications: matching credentials returns 200")
    void verifyUser_matchingCredentials_returns200() throws Exception {
        UserDTO.VerifyUserRequest req = new UserDTO.VerifyUserRequest();
        req.setUsername("testuser");
        req.setEmail("test@example.com");

        when(userService.verifyUserForReset(any(UserDTO.VerifyUserRequest.class)))
            .thenReturn(true);

        mockMvc.perform(post("/api/password-reset-verifications")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isOk())
            .andExpect(content().string("User verified"));
    }

    @Test
    @DisplayName("POST /password-reset-verifications: wrong email returns 400")
    void verifyUser_wrongEmail_returns400() throws Exception {
        UserDTO.VerifyUserRequest req = new UserDTO.VerifyUserRequest();
        req.setUsername("testuser");
        req.setEmail("wrong@example.com");

        when(userService.verifyUserForReset(any(UserDTO.VerifyUserRequest.class)))
            .thenReturn(false);

        mockMvc.perform(post("/api/password-reset-verifications")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Invalid username or email"));
    }

    // ─── POST /api/password-resets ────────────────────────────────────────────────

    @Test
    @DisplayName("POST /password-resets: valid new password returns 200")
    void resetPassword_validPassword_returns200() throws Exception {
        UserDTO.ResetPasswordRequest req = new UserDTO.ResetPasswordRequest();
        req.setUsername("testuser");
        req.setNewPassword("newpassword");

        doNothing().when(userService).resetPassword(any(UserDTO.ResetPasswordRequest.class));

        mockMvc.perform(post("/api/password-resets")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isOk())
            .andExpect(content().string("Password reset successfully"));
    }

    @Test
    @DisplayName("POST /password-resets: same password returns 400")
    void resetPassword_samePassword_returns400() throws Exception {
        UserDTO.ResetPasswordRequest req = new UserDTO.ResetPasswordRequest();
        req.setUsername("testuser");
        req.setNewPassword("samepassword");

        doThrow(new IllegalArgumentException("New password cannot be the same as the old password"))
            .when(userService).resetPassword(any(UserDTO.ResetPasswordRequest.class));

        mockMvc.perform(post("/api/password-resets")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("New password cannot be the same as the old password"));
    }

    // ─── POST /api/user-coins ─────────────────────────────────────────────────────

    @Test
    @WithMockUser
    @DisplayName("POST /user-coins: negative coins returns 400")
    void addCoins_negativeCoinAmount_returns400() throws Exception {
        UserDTO.CoinUpdateRequest req = new UserDTO.CoinUpdateRequest();
        req.setCoinsToAdd(-10);

        mockMvc.perform(post("/api/user-coins")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Coins to add must be non-negative"));
    }

    @Test
    @WithMockUser
    @DisplayName("POST /user-coins: authenticated positive request returns 200")
    void addCoins_authenticatedPositive_returns200() throws Exception {
        UserDTO.CoinUpdateRequest req = new UserDTO.CoinUpdateRequest();
        req.setCoinsToAdd(10);

        when(userService.updateCoins(any(UserDTO.CoinUpdateRequest.class)))
            .thenReturn(sampleAuthResponse);

        mockMvc.perform(post("/api/user-coins")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.token").value("mock-token"));
    }

    @Test
    @WithMockUser
    @DisplayName("POST /contributor-requests: authenticated request returns 200")
    void requestContributor_authenticated_returns200() throws Exception {
        when(userService.requestContributorStatus()).thenReturn(sampleAuthResponse);

        mockMvc.perform(post("/api/contributor-requests")
                .with(csrf()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.token").value("mock-token"));
    }

    @Test
    @WithMockUser
    @DisplayName("POST /lesson-progress-updates: valid request returns 200")
    void updateLessonProgress_validRequest_returns200() throws Exception {
        UserDTO.LessonProgressUpdateRequest req = new UserDTO.LessonProgressUpdateRequest();
        req.setMaxUnlockedLessonIndex(3);

        when(userService.updateLessonProgress(3)).thenReturn(sampleAuthResponse);

        mockMvc.perform(post("/api/lesson-progress-updates")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.token").value("mock-token"));
    }

    @Test
    @WithMockUser
    @DisplayName("PATCH /users/me/profile: valid request returns 200")
    void updateProfile_validRequest_returns200() throws Exception {
        UserDTO.UpdateProfileRequest req = new UserDTO.UpdateProfileRequest();
        req.setUsername("renamed-user");

        when(userService.updateProfile(any(UserDTO.UpdateProfileRequest.class)))
            .thenReturn(sampleAuthResponse);

        mockMvc.perform(patch("/api/users/me/profile")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.token").value("mock-token"));
    }

    @Test
    @WithMockUser
    @DisplayName("PATCH /users/me/password: valid request returns 200")
    void changePassword_validRequest_returns200() throws Exception {
        UserDTO.ChangePasswordRequest req = new UserDTO.ChangePasswordRequest();
        req.setCurrentPassword("old-password");
        req.setNewPassword("new-password");

        doNothing().when(userService).changePassword(any(UserDTO.ChangePasswordRequest.class));

        mockMvc.perform(patch("/api/users/me/password")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isOk())
            .andExpect(content().string("Password updated successfully"));
    }

    @Test
    @WithMockUser
    @DisplayName("DELETE /users/me: authenticated request returns 200")
    void deleteAccount_authenticated_returns200() throws Exception {
        doNothing().when(userService).deleteCurrentUser();

        mockMvc.perform(delete("/api/users/me")
                .with(csrf()))
            .andExpect(status().isOk())
            .andExpect(content().string("Account deleted successfully"));
    }

    @Test
    @WithMockUser
    @DisplayName("POST /session-checks: authenticated request returns 200")
    void sessionChecks_authenticated_returns200() throws Exception {
        mockMvc.perform(post("/api/session-checks")
                .with(csrf()))
            .andExpect(status().isOk());
    }
}
