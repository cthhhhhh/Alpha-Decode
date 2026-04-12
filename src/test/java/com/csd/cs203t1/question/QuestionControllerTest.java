package com.csd.cs203t1.question;

import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.csd.cs203t1.admin.SessionTracker;
import com.csd.cs203t1.security.CustomUserDetailsService;
import com.csd.cs203t1.security.JwtFilter;
import com.csd.cs203t1.security.JwtUtil;
import com.csd.cs203t1.security.SecurityConfig;

@WebMvcTest(QuestionController.class)
@Import({SecurityConfig.class, JwtFilter.class})
@DisplayName("QuestionController WebMvc Tests")
class QuestionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private QuestionService questionService;

    @MockBean
    private SessionTracker sessionTracker;

    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private CustomUserDetailsService userDetailsService;

    @Test
    @DisplayName("GET /api/questions/ is public")
    void getQuestions_public_success() throws Exception {
        IntroQuestion q = IntroQuestion.builder()
                .explanation("explanation")
                .title("title")
                .content("content")
                .build();
        q.setId(1L);

        when(questionService.listQuestions()).thenReturn(List.of(q));

        mockMvc.perform(get("/api/questions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1));
    }

    @Test
    @DisplayName("GET /api/questions/{id}: returns question")
    void getQuestionById_public_success() throws Exception {
        IntroQuestion q = IntroQuestion.builder()
                .explanation("explanation")
                .title("title")
                .content("content")
                .build();
        q.setId(2L);

        when(questionService.getQuestion(2L)).thenReturn(q);

        mockMvc.perform(get("/api/questions/2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(2));
    }

    @Test
    @WithMockUser(roles = "CONTRIBUTOR")
    @DisplayName("POST /api/questions/quiz/{quizId} succeeds for contributor")
    void addQuestion_contributor_success() throws Exception {
        IntroQuestion saved = IntroQuestion.builder()
                .explanation("e")
                .title("t")
                .content("c")
                .build();
        saved.setId(10L);

        when(questionService.addQuestion(org.mockito.ArgumentMatchers.eq(7L), org.mockito.ArgumentMatchers.any(QuestionDTO.class)))
                .thenReturn(saved);

        String body = """
                {
                  "question_type": "INTRO",
                  "explanation": "e",
                  "title": "t",
                  "content": "c"
                }
                """;

        mockMvc.perform(post("/api/questions/quiz/7")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(10));
    }

    @Test
    @WithMockUser(roles = "USER")
    @DisplayName("POST /api/questions/quiz/{quizId} forbidden for regular user")
    void addQuestion_user_forbidden() throws Exception {
        String body = """
                {
                  "question_type": "INTRO",
                  "explanation": "e",
                  "title": "t"
                }
                """;

        mockMvc.perform(post("/api/questions/quiz/7")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("DELETE /api/questions/{id} returns 204 for admin")
    void deleteQuestion_admin_success() throws Exception {
        doNothing().when(questionService).deleteQuestion(5L);

        mockMvc.perform(delete("/api/questions/5"))
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser(roles = "CONTRIBUTOR")
    @DisplayName("PUT /api/questions/{id}: succeeds for contributor")
    void updateQuestion_contributor_success() throws Exception {
        IntroQuestion updated = IntroQuestion.builder()
                .explanation("new explanation")
                .title("new title")
                .content("new content")
                .build();
        updated.setId(5L);

        when(questionService.updateQuestion(org.mockito.ArgumentMatchers.eq(5L), org.mockito.ArgumentMatchers.any(QuestionDTO.class)))
                .thenReturn(updated);

        String body = """
                {
                  "question_type": "INTRO",
                  "explanation": "new explanation",
                  "title": "new title",
                  "content": "new content"
                }
                """;

        mockMvc.perform(put("/api/questions/5")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(5));
    }
}
