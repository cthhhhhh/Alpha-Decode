package com.csd.cs203t1.ai;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.csd.cs203t1.admin.SessionTracker;
import com.csd.cs203t1.security.CustomUserDetailsService;
import com.csd.cs203t1.security.JwtFilter;
import com.csd.cs203t1.security.JwtUtil;
import com.csd.cs203t1.security.SecurityConfig;

@WebMvcTest(AiController.class)
@Import({SecurityConfig.class, JwtFilter.class})
@DisplayName("AiController WebMvc Tests")
class AiControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AiService aiService;

    @MockBean
    private SessionTracker sessionTracker;

    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private CustomUserDetailsService userDetailsService;

    @Test
    @WithMockUser
    @DisplayName("POST /api/ai/feedback returns feedback for authenticated user")
    void getFeedback_authenticated_success() throws Exception {
        when(aiService.getLessonFeedback(anyString(), anyInt(), anyList()))
                .thenReturn(new FeedbackResponse("Nice work", "Try this example", "Question 1: Review tense"));

        String body = """
                {
                  "lessonTitle": "Slang Basics",
                  "score": 80,
                  "wrongQuestions": []
                }
                """;

        mockMvc.perform(post("/api/ai/feedback")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.feedback").value("Nice work"))
                .andExpect(jsonPath("$.example").value("Try this example"));
    }

    @Test
        @DisplayName("POST /api/ai/feedback can be called without explicit mock user")
        void getFeedback_withoutMockUser_returns200() throws Exception {
                when(aiService.getLessonFeedback(anyString(), anyInt(), anyList()))
                                .thenReturn(new FeedbackResponse("Nice work", "Try this example", null));

        String body = """
                {
                  "lessonTitle": "Slang Basics",
                  "score": 80,
                  "wrongQuestions": []
                }
                """;

        mockMvc.perform(post("/api/ai/feedback")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk());
    }
}
