package com.csd.cs203t1.user;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.csd.cs203t1.admin.SessionTracker;
import com.csd.cs203t1.security.CustomUserDetailsService;
import com.csd.cs203t1.security.JwtFilter;
import com.csd.cs203t1.security.JwtUtil;
import com.csd.cs203t1.security.SecurityConfig;

@WebMvcTest(OnboardingController.class)
@Import({SecurityConfig.class, JwtFilter.class})
@DisplayName("OnboardingController WebMvc Tests")
class OnboardingControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @MockBean
    private SessionTracker sessionTracker;

    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private CustomUserDetailsService userDetailsService;

    @Test
    @DisplayName("POST /api/auth/onboarding-complete is permitAll and returns auth response")
    void completeOnboarding_permitAll_success() throws Exception {
        UserDTO.AuthResponse response = new UserDTO.AuthResponse(
                "token", "USER", "newbie", 2, 20, 1, 0
        );
        when(userService.completeOnboarding(any(UserDTO.OnboardingRequest.class))).thenReturn(response);

        String body = """
                {
                  "level": 2,
                  "coins": 20,
                  "faceId": "f1",
                  "bodyTypeId": "b1",
                  "hairId": "h1",
                  "skinColor": "tan",
                  "hairColor": "black"
                }
                """;

        mockMvc.perform(post("/api/auth/onboarding-complete")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("newbie"))
                .andExpect(jsonPath("$.role").value("USER"));
    }
}
