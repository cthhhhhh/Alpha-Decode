package com.csd.cs203t1.shop;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.csd.cs203t1.admin.SessionTracker;
import com.csd.cs203t1.security.CustomUserDetailsService;
import com.csd.cs203t1.security.JwtFilter;
import com.csd.cs203t1.security.JwtUtil;
import com.csd.cs203t1.security.SecurityConfig;
import com.csd.cs203t1.user.User;
import com.csd.cs203t1.user.UserService;

@WebMvcTest(WardrobeController.class)
@Import({SecurityConfig.class, JwtFilter.class})
@DisplayName("WardrobeController Unit Tests")
class WardrobeControllerTest {

    @Autowired private MockMvc mockMvc;

    @MockBean private ShopService shopService;
    @MockBean private UserService userService;
    @MockBean private SessionTracker sessionTracker; // Needed by JwtFilter
    @MockBean private JwtUtil jwtUtil;
    @MockBean private CustomUserDetailsService userDetailsService;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setUsername("testuser");
    }

    @Test
    @WithMockUser(username = "testuser")
    @DisplayName("POST /api/wardrobe/equipped-items/{id}: success")
    void equipItem_success() throws Exception {
        when(userService.getCurrentUserReadOnly()).thenReturn(user);
        when(shopService.equipItem(eq(user), eq(1L))).thenReturn(new ShopDTO.EquipResponse(1L, null));

        mockMvc.perform(post("/api/wardrobe/equipped-items/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.equippedOutfitId").value(1));
    }

    @Test
    @WithMockUser(username = "testuser")
    @DisplayName("DELETE /api/wardrobe/equipped-slots/{slot}: success for outfit")
    void unequipSlot_outfit_success() throws Exception {
        when(userService.getCurrentUserReadOnly()).thenReturn(user);
        when(shopService.unequipSlot(eq(user), eq("outfit"))).thenReturn(new ShopDTO.EquipResponse(null, null));

        mockMvc.perform(delete("/api/wardrobe/equipped-slots/outfit"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.equippedOutfitId").isEmpty());
    }

    @Test
    @WithMockUser(username = "testuser")
    @DisplayName("DELETE /api/wardrobe/equipped-slots/{slot}: returns 400 for unknown slot")
    void unequipSlot_unknown_fail_returns400() throws Exception {
        when(userService.getCurrentUserReadOnly()).thenReturn(user);
        when(shopService.unequipSlot(eq(user), eq("foo"))).thenThrow(new IllegalArgumentException("Unknown slot: foo"));

        mockMvc.perform(delete("/api/wardrobe/equipped-slots/foo"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Unknown slot: foo"));
    }
}
