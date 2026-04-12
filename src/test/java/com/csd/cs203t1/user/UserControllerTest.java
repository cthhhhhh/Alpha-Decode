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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
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

    // ─── POST /api/auth/register ─────────────────────────────────────────────────

    @Test
    @DisplayName("POST /register: valid request returns 200 with auth response")
    void register_validRequest_returns200() throws Exception {
        UserDTO.RegisterRequest req = new UserDTO.RegisterRequest();
        req.setUsername("newuser");
        req.setEmail("new@example.com");
        req.setPassword("password123");

        when(userService.register(any(UserDTO.RegisterRequest.class)))
            .thenReturn(sampleAuthResponse);

        mockMvc.perform(post("/api/auth/register")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.token").value("mock-token"))
            .andExpect(jsonPath("$.username").value("testuser"))
            .andExpect(jsonPath("$.role").value("user"));
    }

    @Test
    @DisplayName("POST /register: duplicate username returns 400 with error message")
    void register_duplicateUsername_returns400() throws Exception {
        UserDTO.RegisterRequest req = new UserDTO.RegisterRequest();
        req.setUsername("existing");
        req.setEmail("test@example.com");
        req.setPassword("password123");

        when(userService.register(any(UserDTO.RegisterRequest.class)))
            .thenThrow(new IllegalArgumentException("Username is already taken"));

        mockMvc.perform(post("/api/auth/register")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Username is already taken"));
    }

    // ─── POST /api/auth/login ────────────────────────────────────────────────────

    @Test
    @DisplayName("POST /login: valid credentials returns 200 with token")
    void login_validCredentials_returns200() throws Exception {
        UserDTO.LoginRequest req = new UserDTO.LoginRequest();
        req.setUsername("testuser");
        req.setPassword("password123");

        when(userService.login(any(UserDTO.LoginRequest.class)))
            .thenReturn(sampleAuthResponse);

        mockMvc.perform(post("/api/auth/login")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.token").value("mock-token"));
    }

    @Test
    @DisplayName("POST /login: invalid password returns 400")
    void login_invalidPassword_returns400() throws Exception {
        UserDTO.LoginRequest req = new UserDTO.LoginRequest();
        req.setUsername("testuser");
        req.setPassword("wrongpass");

        when(userService.login(any(UserDTO.LoginRequest.class)))
            .thenThrow(new IllegalArgumentException("Invalid username or password"));

        mockMvc.perform(post("/api/auth/login")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Invalid username or password"));
    }

    // ─── POST /api/auth/register-contributor ─────────────────────────────────────

    @Test
    @DisplayName("POST /register-contributor: valid request returns 200 with message")
    void registerContributor_validRequest_returns200() throws Exception {
        UserDTO.RegisterRequest req = new UserDTO.RegisterRequest();
        req.setUsername("contrib");
        req.setEmail("contrib@example.com");
        req.setPassword("pass123");

        doNothing().when(userService).registerContributor(any(UserDTO.RegisterRequest.class));

        mockMvc.perform(post("/api/auth/register-contributor")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.message").value(
                "Registration successful. Await admin approval before logging in."));
    }

    @Test
    @DisplayName("POST /register-contributor: duplicate username returns 400")
    void registerContributor_duplicateUsername_returns400() throws Exception {
        UserDTO.RegisterRequest req = new UserDTO.RegisterRequest();
        req.setUsername("taken");
        req.setEmail("taken@example.com");
        req.setPassword("pass123");

        doThrow(new IllegalArgumentException("Username is already taken"))
            .when(userService).registerContributor(any(UserDTO.RegisterRequest.class));

        mockMvc.perform(post("/api/auth/register-contributor")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Username is already taken"));
    }

    // ─── POST /api/auth/register-admin (security rule) ─────────────────────────

    @Test
    @WithMockUser(roles = "USER")
    @DisplayName("POST /register-admin: USER role is forbidden")
    void registerAdmin_asUser_returns403() throws Exception {
        UserDTO.RegisterRequest req = new UserDTO.RegisterRequest();
        req.setUsername("admincandidate");
        req.setEmail("admin@example.com");
        req.setPassword("password123");

        mockMvc.perform(post("/api/auth/register-admin")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isForbidden());

        verify(userService, never()).registerAdmin(any(UserDTO.RegisterRequest.class));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("POST /register-admin: ADMIN role can access")
    void registerAdmin_asAdmin_returns200() throws Exception {
        UserDTO.RegisterRequest req = new UserDTO.RegisterRequest();
        req.setUsername("newadmin");
        req.setEmail("newadmin@example.com");
        req.setPassword("password123");

        when(userService.registerAdmin(any(UserDTO.RegisterRequest.class)))
            .thenReturn(sampleAuthResponse);

        mockMvc.perform(post("/api/auth/register-admin")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.token").value("mock-token"));
    }

    // ─── GET /api/auth/me ────────────────────────────────────────────────────────

    @Test
    @WithMockUser(username = "testuser")
    @DisplayName("GET /me: authenticated user returns 200 with profile")
    void getMe_authenticated_returns200() throws Exception {
        when(userService.getMe()).thenReturn(sampleAuthResponse);

        mockMvc.perform(get("/api/auth/me"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.username").value("testuser"));
    }

    @Test
    @WithMockUser(username = "testuser")
    @DisplayName("GET /me: service throws exception returns 401")
    void getMe_serviceThrows_returns401() throws Exception {
        when(userService.getMe()).thenThrow(new RuntimeException("Not found"));

        mockMvc.perform(get("/api/auth/me"))
            .andExpect(status().isUnauthorized())
            .andExpect(content().string("Not authenticated"));
    }


    // ─── POST /api/auth/verify-user ──────────────────────────────────────────────

    @Test
    @DisplayName("POST /verify-user: matching credentials returns 200")
    void verifyUser_matchingCredentials_returns200() throws Exception {
        UserDTO.VerifyUserRequest req = new UserDTO.VerifyUserRequest();
        req.setUsername("testuser");
        req.setEmail("test@example.com");

        when(userService.verifyUserForReset(any(UserDTO.VerifyUserRequest.class)))
            .thenReturn(true);

        mockMvc.perform(post("/api/auth/verify-user")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isOk())
            .andExpect(content().string("User verified"));
    }

    @Test
    @DisplayName("POST /verify-user: wrong email returns 400")
    void verifyUser_wrongEmail_returns400() throws Exception {
        UserDTO.VerifyUserRequest req = new UserDTO.VerifyUserRequest();
        req.setUsername("testuser");
        req.setEmail("wrong@example.com");

        when(userService.verifyUserForReset(any(UserDTO.VerifyUserRequest.class)))
            .thenReturn(false);

        mockMvc.perform(post("/api/auth/verify-user")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Invalid username or email"));
    }

    // ─── POST /api/auth/reset-password ───────────────────────────────────────────

    @Test
    @DisplayName("POST /reset-password: valid new password returns 200")
    void resetPassword_validPassword_returns200() throws Exception {
        UserDTO.ResetPasswordRequest req = new UserDTO.ResetPasswordRequest();
        req.setUsername("testuser");
        req.setNewPassword("newpassword");

        doNothing().when(userService).resetPassword(any(UserDTO.ResetPasswordRequest.class));

        mockMvc.perform(post("/api/auth/reset-password")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isOk())
            .andExpect(content().string("Password reset successfully"));
    }

    @Test
    @DisplayName("POST /reset-password: same password returns 400")
    void resetPassword_samePassword_returns400() throws Exception {
        UserDTO.ResetPasswordRequest req = new UserDTO.ResetPasswordRequest();
        req.setUsername("testuser");
        req.setNewPassword("samepassword");

        doThrow(new IllegalArgumentException("New password cannot be the same as the old password"))
            .when(userService).resetPassword(any(UserDTO.ResetPasswordRequest.class));

        mockMvc.perform(post("/api/auth/reset-password")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("New password cannot be the same as the old password"));
    }

    // ─── POST /api/auth/coins ─────────────────────────────────────────────────────

    @Test
    @WithMockUser
    @DisplayName("POST /coins: negative coins returns 400")
    void addCoins_negativeCoinAmount_returns400() throws Exception {
        UserDTO.CoinUpdateRequest req = new UserDTO.CoinUpdateRequest();
        req.setCoinsToAdd(-10);

        mockMvc.perform(post("/api/auth/coins")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Coins to add must be non-negative"));
    }

    @Test
    @WithMockUser
    @DisplayName("POST /coins: authenticated positive request returns 200")
    void addCoins_authenticatedPositive_returns200() throws Exception {
        UserDTO.CoinUpdateRequest req = new UserDTO.CoinUpdateRequest();
        req.setCoinsToAdd(10);

        when(userService.updateCoins(any(UserDTO.CoinUpdateRequest.class)))
            .thenReturn(sampleAuthResponse);

        mockMvc.perform(post("/api/auth/coins")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.token").value("mock-token"));
    }
}
