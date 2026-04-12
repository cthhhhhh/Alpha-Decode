package com.csd.cs203t1.quiz;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import com.csd.cs203t1.question.Question;
import com.csd.cs203t1.security.JwtFilter;
import com.csd.cs203t1.security.SecurityConfig;
import com.csd.cs203t1.user.User;
import com.csd.cs203t1.user.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(QuizController.class)
@Import({SecurityConfig.class, JwtFilter.class})
@DisplayName("QuizController Integration Tests")
class QuizControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @MockBean private QuizService quizService;
    @MockBean private UserService userService;

    // Security dependencies
    @MockBean private com.csd.cs203t1.security.JwtUtil jwtUtil;
    @MockBean private com.csd.cs203t1.security.CustomUserDetailsService customUserDetailsService;
    @MockBean private com.csd.cs203t1.admin.SessionTracker sessionTracker;

    @Test
    @WithMockUser
    void getDailyQuiz_notCompleted_returnsQuestions() throws Exception {
        User mockUser = new User();
        mockUser.setDailyQuizLastDate(LocalDate.now().minusDays(1)); // Not today
        when(userService.getCurrentUserReadOnly()).thenReturn(mockUser);

        Question q1 = new com.csd.cs203t1.question.SelectQuestion(); q1.setId(1L);
        Question q2 = new com.csd.cs203t1.question.SelectQuestion(); q2.setId(2L);
        Question q3 = new com.csd.cs203t1.question.SelectQuestion(); q3.setId(3L);
        when(quizService.getDailyQuizQuestions()).thenReturn(List.of(q1, q2, q3));

        mockMvc.perform(get("/api/quiz/daily"))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.length()").value(3));
    }

    @Test
    @WithMockUser
    void getDailyQuiz_alreadyCompleted_returns409() throws Exception {
        User mockUser = new User();
        mockUser.setDailyQuizLastDate(LocalDate.now()); // Already completed today!
        when(userService.getCurrentUserReadOnly()).thenReturn(mockUser);

        mockMvc.perform(get("/api/quiz/daily"))
               .andExpect(status().isConflict());
    }

    @Test
    void getDailyQuiz_unauthenticated_returns401() throws Exception {
        when(userService.getCurrentUserReadOnly()).thenThrow(new RuntimeException("No user"));

        mockMvc.perform(get("/api/quiz/daily"))
               .andExpect(status().isUnauthorized());
    }

    @Test
    void getOnboardingQuiz_valid_returnsQuiz() throws Exception {
        Question q1 = new com.csd.cs203t1.question.SelectQuestion(); q1.setId(10L);
        when(quizService.getOnboardingQuizQuestions()).thenReturn(List.of(q1));

        mockMvc.perform(get("/api/quiz/onboarding"))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    void getRevisionQuizzes_returnsShuffledList() throws Exception {
        Question q1 = new com.csd.cs203t1.question.SelectQuestion(); q1.setId(30L);
        Question q2 = new com.csd.cs203t1.question.SelectQuestion(); q2.setId(31L);
        when(quizService.getRevisionQuizzes()).thenReturn(List.of(java.util.Map.of(
            "id", 99L,
            "afterLessonIndex", 2,
            "questions", List.of(q1, q2)
        )));

        mockMvc.perform(get("/api/quiz/revision"))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.length()").value(1))
               .andExpect(jsonPath("$[0].id").value(99))
               .andExpect(jsonPath("$[0].afterLessonIndex").value(2));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createRevisionQuiz_asAdmin_returnsCreated() throws Exception {
        RevisionQuiz rq = new RevisionQuiz();
        rq.setAfterLessonIndex(3);

        when(quizService.createRevisionQuiz(any(RevisionQuiz.class))).thenReturn(rq);

        mockMvc.perform(post("/api/quiz/revision").with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(rq)))
               .andExpect(status().isCreated());
    }

    @Test
    @WithMockUser(roles = "USER")
    void createRevisionQuiz_asUser_returnsForbidden() throws Exception {
        RevisionQuiz rq = new RevisionQuiz();
        rq.setAfterLessonIndex(3);

        mockMvc.perform(post("/api/quiz/revision").with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(rq)))
               .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void updateRevisionQuiz_asAdmin_returnsOk() throws Exception {
        RevisionQuiz updatedRq = new RevisionQuiz();
        updatedRq.setAfterLessonIndex(5);
        when(quizService.updateRevisionQuiz(any(Long.class), any(RevisionQuiz.class))).thenReturn(Optional.of(updatedRq));

        mockMvc.perform(put("/api/quiz/revision/1").with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedRq)))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.afterLessonIndex").value(5));

        verify(quizService).updateRevisionQuiz(eq(1L), any(RevisionQuiz.class));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void deleteRevisionQuiz_asAdmin_returnsNoContent() throws Exception {
        when(quizService.revisionQuizExists(1L)).thenReturn(true);

        mockMvc.perform(delete("/api/quiz/revision/1").with(csrf()))
               .andExpect(status().isNoContent());
    }
}
