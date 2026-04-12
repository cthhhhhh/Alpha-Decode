package com.csd.cs203t1.shop;

import com.csd.cs203t1.security.CustomUserDetailsService;
import com.csd.cs203t1.security.JwtFilter;
import com.csd.cs203t1.security.JwtUtil;
import com.csd.cs203t1.security.SecurityConfig;
import com.csd.cs203t1.user.User;
import com.csd.cs203t1.user.UserService;
import com.csd.cs203t1.admin.SessionTracker;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ShopController.class)
@Import({SecurityConfig.class, JwtFilter.class})
@DisplayName("ShopController Unit Tests")
class ShopControllerTest {

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
    @DisplayName("GET /api/shop: success returns item list")
    void getShopItems_success() throws Exception {
        when(userService.getCurrentUserReadOnly()).thenReturn(user);
        when(shopService.getShopItems(user)).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/shop"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "testuser")
    @DisplayName("POST /api/shop/buy/{id}: success")
    void buyItem_success() throws Exception {
        when(userService.getCurrentUserReadOnly()).thenReturn(user);
        when(shopService.buyItem(eq(user), eq(1L))).thenReturn(new ShopDTO.EquipResponse(1L, null));

        mockMvc.perform(post("/api/shop/buy/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.equippedOutfitId").value(1));
    }

    @Test
    @WithMockUser(username = "testuser")
    @DisplayName("POST /api/shop/buy/{id}: returns 400 on error")
    void buyItem_fail_returns400() throws Exception {
        when(userService.getCurrentUserReadOnly()).thenReturn(user);
        when(shopService.buyItem(eq(user), anyLong())).thenThrow(new IllegalArgumentException("Insufficient coins"));

        mockMvc.perform(post("/api/shop/buy/1"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Insufficient coins"));
    }
}
