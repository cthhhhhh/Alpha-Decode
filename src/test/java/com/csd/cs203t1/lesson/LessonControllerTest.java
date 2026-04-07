package com.csd.cs203t1.lesson;

import com.csd.cs203t1.security.CustomUserDetailsService;
import com.csd.cs203t1.security.JwtFilter;
import com.csd.cs203t1.security.JwtUtil;
import com.csd.cs203t1.security.SecurityConfig;
import com.csd.cs203t1.admin.SessionTracker;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(LessonController.class)
@Import({SecurityConfig.class, JwtFilter.class})
@DisplayName("LessonController Unit Tests")
class LessonControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @MockBean private LessonService lessonService;
    @MockBean private SessionTracker sessionTracker; // Needed by JwtFilter
    @MockBean private JwtUtil jwtUtil;
    @MockBean private CustomUserDetailsService userDetailsService;

    private Lesson lesson;

    @BeforeEach
    void setUp() {
        lesson = new Lesson();
        lesson.setId(1L);
        lesson.setTitle("Introduction to Java");
    }

    @Test
    @DisplayName("GET /api/lessons/: success returns list")
    void getLessons_success() throws Exception {
        when(lessonService.listLessons()).thenReturn(Collections.singletonList(lesson));

        mockMvc.perform(get("/api/lessons/"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Introduction to Java"));
    }

    @Test
    @DisplayName("GET /api/lessons/{id}: success")
    void getLesson_success() throws Exception {
        when(lessonService.getLesson(1L)).thenReturn(lesson);

        mockMvc.perform(get("/api/lessons/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("DELETE /api/lessons/{id}: 200 OK for ADMIN")
    void deleteLesson_asAdmin_success() throws Exception {
        mockMvc.perform(delete("/api/lessons/1"))
                .andExpect(status().isOk());

        verify(lessonService).deleteLesson(1L);
    }

    @Test
    @WithMockUser(roles = "USER")
    @DisplayName("DELETE /api/lessons/{id}: 403 Forbidden for USER")
    void deleteLesson_asUser_forbidden() throws Exception {
        mockMvc.perform(delete("/api/lessons/1"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "CONTRIBUTOR")
    @DisplayName("POST /api/lessons/create: 201 Created for CONTRIBUTOR")
    void createLesson_asContributor_success() throws Exception {
        when(lessonService.addLesson(any(), any())).thenReturn(lesson);

        LessonController.CreateLessonRequest req = new LessonController.CreateLessonRequest();
        
        mockMvc.perform(post("/api/lessons/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    @WithMockUser(roles = "CONTRIBUTOR")
    @DisplayName("PUT /api/lessons/{id}: success as CONTRIBUTOR")
    void updateLesson_asContributor_success() throws Exception {
        when(lessonService.updateLesson(eq(1L), any())).thenReturn(lesson);

        mockMvc.perform(put("/api/lessons/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isOk());
    }
}
