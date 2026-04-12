package com.csd.cs203t1.bookmark;

import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.csd.cs203t1.admin.SessionTracker;
import com.csd.cs203t1.security.CustomUserDetailsService;
import com.csd.cs203t1.security.JwtFilter;
import com.csd.cs203t1.security.JwtUtil;
import com.csd.cs203t1.security.SecurityConfig;

@WebMvcTest(BookmarkController.class)
@Import({SecurityConfig.class, JwtFilter.class})
@DisplayName("BookmarkController WebMvc Tests")
class BookmarkControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private BookmarkService bookmarkService;

    @MockBean
    private SessionTracker sessionTracker;

    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private CustomUserDetailsService userDetailsService;

    @Test
    @WithMockUser
    @DisplayName("GET /api/bookmarks returns bookmark ids")
    void getBookmarks_success() throws Exception {
        when(bookmarkService.getBookmarkIdsForCurrentUser()).thenReturn(List.of(2L, 5L));

        mockMvc.perform(get("/api/bookmarks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0]").value(2))
                .andExpect(jsonPath("$[1]").value(5));
    }

    @Test
    @WithMockUser
    @DisplayName("POST /api/bookmarks/{termId} returns 200 on success")
    void addBookmark_success() throws Exception {
        doNothing().when(bookmarkService).addBookmarkForCurrentUser(9L);

        mockMvc.perform(post("/api/bookmarks/9"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser
    @DisplayName("POST /api/bookmarks/{termId} returns 400 on invalid term")
    void addBookmark_invalidTerm_returns400() throws Exception {
        doThrow(new IllegalArgumentException("Term not found")).when(bookmarkService).addBookmarkForCurrentUser(9L);

        mockMvc.perform(post("/api/bookmarks/9"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Term not found"));
    }

    @Test
    @WithMockUser
    @DisplayName("DELETE /api/bookmarks/{termId} returns 401 when service throws auth error")
    void removeBookmark_authError_returns401() throws Exception {
        doThrow(new RuntimeException("Not authenticated")).when(bookmarkService).removeBookmarkForCurrentUser(3L);

        mockMvc.perform(delete("/api/bookmarks/3"))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("Not authenticated"));
    }
}
