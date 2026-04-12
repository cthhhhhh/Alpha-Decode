package com.csd.cs203t1.user;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.csd.cs203t1.DataSeeder;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * INTEGRATION TESTS
 *
 * Unlike unit tests (which mock all dependencies), integration tests load the
 * FULL application context (@SpringBootTest) and use a real in-memory H2 database.
 *
 * This verifies that all layers — Controller → Service → Repository → Database —
 * work together correctly end-to-end.
 *
 * DataSeeder is mocked to prevent loading production test data during tests.
 */
@SpringBootTest
@AutoConfigureMockMvc
@DisplayName("User Integration Tests (Full Stack End-to-End)")
class UserIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    // Prevent DataSeeder from running and inserting seed data into H2
    @MockBean private DataSeeder dataSeeder;

    // ─── Integration Test: Register + Login Flow ──────────────────────────────────

    @Test
    @DisplayName("Integration: register → login full flow returns valid JWT token")
    void integration_registerThenLogin_returnsJwtToken() throws Exception {
        // ARRANGE — unique username to avoid conflict between test runs
        String username = "integrationUser_" + System.currentTimeMillis();
        Map<String, String> registerPayload = Map.of(
            "username", username,
            "email",    username + "@test.com",
            "password", "password123"
        );

        // ACT 1 — Register a new user (full stack: HTTP → Controller → Service → H2 DB)
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerPayload)))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.token").isNotEmpty())
               .andExpect(jsonPath("$.username").value(username))
               .andExpect(jsonPath("$.role").value("USER"));

        // ARRANGE 2 — Login payload
        Map<String, String> loginPayload = Map.of(
            "username", username,
            "password", "password123"
        );

        // ACT 2 — Login with the same user (verifies DB actually persisted them)
        MvcResult loginResult = mockMvc.perform(post("/api/sessions")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginPayload)))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.token").isNotEmpty())
               .andExpect(jsonPath("$.username").value(username))
               .andReturn();

        // ASSERT — extract JWT from login response and verify it is a non-empty string
        String responseBody = loginResult.getResponse().getContentAsString();
        Map<?, ?> responseMap = objectMapper.readValue(responseBody, Map.class);
        String jwtToken = (String) responseMap.get("token");
        assertNotNull(jwtToken, "JWT token should not be null");
        assertFalse(jwtToken.isBlank(), "JWT token should not be blank");
        // JWT tokens have 3 dot-separated sections
        assertEquals(3, jwtToken.split("\\.").length, "JWT token should have 3 parts");
    }

    // ─── Integration Test: Duplicate Registration ─────────────────────────────────

    @Test
    @DisplayName("Integration: duplicate registration returns 400 Bad Request")
    void integration_duplicateRegister_returns400() throws Exception {
        // ARRANGE
        String username = "dupUser_" + System.currentTimeMillis();
        Map<String, String> payload = Map.of(
            "username", username,
            "email",    username + "@test.com",
            "password", "password123"
        );

        // ACT 1 — First registration (should succeed)
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(payload)))
               .andExpect(status().isOk());

        // ACT 2 — Same registration again (should fail with 400)
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(payload)))
               .andExpect(status().isBadRequest());
    }

    // ─── Integration Test: Login with Wrong Password ──────────────────────────────

    @Test
    @DisplayName("Integration: login with wrong password returns 400 Bad Request")
    void integration_loginWrongPassword_returns400() throws Exception {
        // ARRANGE — Register first
        String username = "wrongPassUser_" + System.currentTimeMillis();
        Map<String, String> registerPayload = Map.of(
            "username", username,
            "email",    username + "@test.com",
            "password", "correctPassword"
        );
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerPayload)))
               .andExpect(status().isOk());

        // ACT — Attempt login with wrong password
        Map<String, String> loginPayload = Map.of(
            "username", username,
            "password", "WRONGPASSWORD"
        );
        mockMvc.perform(post("/api/sessions")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginPayload)))
               .andExpect(status().isBadRequest());
    }

    // ─── Integration Test: Protected Endpoint Without Token ───────────────────────

    @Test
    @DisplayName("Integration: accessing protected endpoint without JWT returns 401 Unauthorized")
    void integration_protectedEndpoint_noToken_returns401() throws Exception {
        // ACT — GET /api/users/me requires a valid JWT token
        // Without one, the full security chain returns 401 Unauthorized
        mockMvc.perform(get("/api/users/me"))
               .andExpect(status().isUnauthorized());
    }
}
