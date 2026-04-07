package com.csd.cs203t1.draft;

import com.csd.cs203t1.security.CustomUserDetailsService;
import com.csd.cs203t1.security.JwtFilter;
import com.csd.cs203t1.security.JwtUtil;
import com.csd.cs203t1.security.SecurityConfig;
import com.csd.cs203t1.user.User;
import com.csd.cs203t1.user.UserService;
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

@WebMvcTest(DraftController.class)
@Import({SecurityConfig.class, JwtFilter.class})
@DisplayName("DraftController Unit Tests")
class DraftControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @MockBean private DraftService draftService;
    @MockBean private UserService userService;
    @MockBean private SessionTracker sessionTracker; // Needed by JwtFilter
    @MockBean private JwtUtil jwtUtil;
    @MockBean private CustomUserDetailsService userDetailsService;

    private User contributor;
    private DraftDTO.DraftResponse draftResponse;

    @BeforeEach
    void setUp() {
        contributor = new User();
        contributor.setId(10L);
        contributor.setUsername("contributor");

        draftResponse = new DraftDTO.DraftResponse();
        draftResponse.setId(1L);
        draftResponse.setContributorId(10L);
        draftResponse.setTitle("Mock Draft");
        draftResponse.setStatus(DraftStatus.DRAFT);
    }

    @Test
    @WithMockUser(roles = "CONTRIBUTOR")
    @DisplayName("POST /api/drafts: success as CONTRIBUTOR")
    void createDraft_success() throws Exception {
        when(userService.getCurrentUser()).thenReturn(contributor);
        when(draftService.createDraft(any(), eq(10L))).thenReturn(draftResponse);

        DraftDTO.CreateOrUpdateDraftRequest req = new DraftDTO.CreateOrUpdateDraftRequest();
        req.setTitle("Mock Draft");

        mockMvc.perform(post("/api/drafts")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Mock Draft"));
    }

    @Test
    @WithMockUser(roles = "USER")
    @DisplayName("POST /api/drafts: forbidden as USER")
    void createDraft_forbidden() throws Exception {
        mockMvc.perform(post("/api/drafts")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "CONTRIBUTOR")
    @DisplayName("PUT /api/drafts/{id}: success")
    void updateDraft_success() throws Exception {
        when(userService.getCurrentUser()).thenReturn(contributor);
        when(draftService.updateDraft(eq(1L), any(), eq(10L))).thenReturn(draftResponse);

        mockMvc.perform(put("/api/drafts/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"title\":\"Updated\"}"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("GET /api/drafts/pending: success as ADMIN")
    void getPendingDrafts_asAdmin() throws Exception {
        when(draftService.getPendingDrafts()).thenReturn(Collections.singletonList(draftResponse));

        mockMvc.perform(get("/api/drafts/pending"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("POST /api/drafts/{id}/approve: success as ADMIN")
    void approveDraft_success() throws Exception {
        when(draftService.approveDraft(1L)).thenReturn(draftResponse);

        mockMvc.perform(post("/api/drafts/1/approve"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "CONTRIBUTOR")
    @DisplayName("POST /api/drafts/{id}/submit: success")
    void submitDraft_success() throws Exception {
        when(userService.getCurrentUser()).thenReturn(contributor);
        when(draftService.submitDraft(1L, 10L)).thenReturn(draftResponse);

        mockMvc.perform(post("/api/drafts/1/submit"))
                .andExpect(status().isOk());
    }
}
