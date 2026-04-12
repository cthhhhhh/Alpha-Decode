package com.csd.cs203t1.term;

import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import static org.mockito.Mockito.doNothing;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.csd.cs203t1.admin.SessionTracker;
import com.csd.cs203t1.security.CustomUserDetailsService;
import com.csd.cs203t1.security.JwtFilter;
import com.csd.cs203t1.security.JwtUtil;
import com.csd.cs203t1.security.SecurityConfig;

@WebMvcTest(TermController.class)
@Import({SecurityConfig.class, JwtFilter.class})
@DisplayName("TermController WebMvc Tests")
class TermControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TermService termService;

    @MockBean
    private SessionTracker sessionTracker;

    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private CustomUserDetailsService userDetailsService;

    @Test
    @DisplayName("GET /api/terms/ is public")
    void getTerms_public_success() throws Exception {
        Term t = new Term();
        t.setId(1L);
        t.setTerm("rizz");
        t.setDefinition("charisma");
        t.setExample("big rizz");
        t.setDifficulty(Difficulty.EASY);
        t.setCategory(Category.NOUN);
        when(termService.listTerms()).thenReturn(List.of(t));

        mockMvc.perform(get("/api/terms/"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].term").value("rizz"));
    }

    @Test
    @WithMockUser(roles = "CONTRIBUTOR")
    @DisplayName("POST /api/terms/create succeeds for contributor")
    void createTerm_contributor_success() throws Exception {
        Term t = new Term();
        t.setId(5L);
        t.setTerm("beta");
        t.setDefinition("definition");
        t.setExample("example");
        t.setDifficulty(Difficulty.MEDIUM);
        t.setCategory(Category.ADJECTIVE);

        when(termService.createTerm(org.mockito.ArgumentMatchers.any(Term.class))).thenReturn(t);

        String body = """
                {
                  "term": "beta",
                  "definition": "definition",
                  "example": "example",
                  "difficulty": "MEDIUM",
                  "category": "ADJECTIVE"
                }
                """;

        mockMvc.perform(post("/api/terms/create")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(5));
    }

    @Test
    @WithMockUser(roles = "USER")
    @DisplayName("POST /api/terms/create forbidden for regular user")
    void createTerm_user_forbidden() throws Exception {
        mockMvc.perform(post("/api/terms/create")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("PUT /api/terms/{id} returns updated term")
    void updateTerm_admin_success() throws Exception {
        Term t = new Term();
        t.setId(8L);
        t.setTerm("updated");
        t.setDefinition("d");
        t.setExample("e");
        t.setDifficulty(Difficulty.HARD);
        t.setCategory(Category.REACTION);

        when(termService.updateTerm(org.mockito.ArgumentMatchers.eq(8L), org.mockito.ArgumentMatchers.any(Term.class)))
                .thenReturn(t);

        String body = """
                {
                  "term": "updated",
                  "definition": "d",
                  "example": "e",
                  "difficulty": "HARD",
                  "category": "REACTION"
                }
                """;

        mockMvc.perform(put("/api/terms/8")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.term").value("updated"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("DELETE /api/terms/{id} succeeds for admin")
    void deleteTerm_admin_success() throws Exception {
        doNothing().when(termService).deleteTerm(3L);

        mockMvc.perform(delete("/api/terms/3"))
                .andExpect(status().isOk());

                verify(termService).deleteTerm(3L);
    }
}
